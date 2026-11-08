//! On-chain receipt lifecycle for Swaraj.
//!
//! Mirrors `packages/database/migrations/0002-receipts.sql`:
//!   PENDING → {PROVED, NON_PROVABLE, INVALIDATED}
//!   PROVED  → {INVALIDATED}
//! Every other move panics.
//!
//! Only the owner creates receipts or changes them by hand. PROVED is reached
//! only through `prove`: the verifier contract checks the proof, and the
//! receipt moves only if the proved statement hashes to its `claim_hash`.
//! That makes `prove` safe to leave open to anyone.

use near_sdk::json_types::Base64VecU8;
use near_sdk::store::IterableMap;
use near_sdk::{env, ext_contract, near, require, AccountId, Gas, PanicOnDefault, Promise, PromiseError};

/// A verification costs about 34 Tgas on testnet.
const VERIFY_GAS: Gas = Gas::from_tgas(50);
const CALLBACK_GAS: Gas = Gas::from_tgas(10);

#[ext_contract(verifier)]
#[allow(dead_code)]
trait Verifier {
    fn verify(&self, program: String, public_values: Base64VecU8, proof: Base64VecU8) -> String;
}

/// Receipt states stored on chain. Names match the SQL CHECK constraint.
#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ReceiptState {
    Pending,
    Proved,
    NonProvable,
    Invalidated,
}

impl ReceiptState {
    fn as_str(&self) -> &'static str {
        match self {
            Self::Pending => "PENDING",
            Self::Proved => "PROVED",
            Self::NonProvable => "NON_PROVABLE",
            Self::Invalidated => "INVALIDATED",
        }
    }

    /// Legal edges from `0002-receipts.sql` `guard_receipt_transition`.
    fn can_move_to(&self, next: &ReceiptState) -> bool {
        matches!(
            (self, next),
            (Self::Pending, Self::Proved)
                | (Self::Pending, Self::NonProvable)
                | (Self::Pending, Self::Invalidated)
                | (Self::Proved, Self::Invalidated)
        )
    }
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ReceiptRecord {
    pub receipt_id: String,
    pub app_id: String,
    pub intent_digest: String,
    /// Lowercase hex SHA-256 of the statement a proof must prove.
    pub claim_hash: String,
    pub state: ReceiptState,
    pub proof_ref: Option<String>,
    pub updated_at: u64,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ReceiptEvent {
    pub receipt_id: String,
    pub from_state: ReceiptState,
    pub to_state: ReceiptState,
    pub note: Option<String>,
    pub at: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Receipts {
    owner: AccountId,
    /// Optional verifier account (wired on Nov 8 for PROVED).
    verifier: Option<AccountId>,
    receipts: IterableMap<String, ReceiptRecord>,
    events: IterableMap<u64, ReceiptEvent>,
    next_event: u64,
}

#[near]
impl Receipts {
    #[init]
    pub fn new(verifier: Option<AccountId>) -> Self {
        Self {
            owner: env::predecessor_account_id(),
            verifier,
            receipts: IterableMap::new(b"r"),
            events: IterableMap::new(b"e"),
            next_event: 0,
        }
    }

    pub fn owner(&self) -> AccountId {
        self.owner.clone()
    }

    pub fn verifier(&self) -> Option<AccountId> {
        self.verifier.clone()
    }

    pub fn set_verifier(&mut self, verifier: AccountId) {
        self.assert_owner();
        self.verifier = Some(verifier);
    }

    /// Create a PENDING receipt. Same `receipt_id` twice panics (idempotent create is explicit).
    pub fn create_pending(
        &mut self,
        receipt_id: String,
        app_id: String,
        intent_digest: String,
        claim_hash: String,
    ) -> ReceiptRecord {
        self.assert_owner();
        require!(!receipt_id.is_empty(), "empty receipt_id");
        require!(!app_id.is_empty(), "empty app_id");
        require!(!intent_digest.is_empty(), "empty intent_digest");
        require!(
            claim_hash.len() == 64 && claim_hash.bytes().all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b)),
            "claim_hash must be lowercase hex SHA-256"
        );
        require!(
            !self.receipts.contains_key(&receipt_id),
            "receipt already exists"
        );

        let record = ReceiptRecord {
            receipt_id: receipt_id.clone(),
            app_id,
            intent_digest,
            claim_hash,
            state: ReceiptState::Pending,
            proof_ref: None,
            updated_at: env::block_timestamp(),
        };
        self.receipts.insert(receipt_id, record.clone());
        record
    }

    pub fn get(&self, receipt_id: String) -> Option<ReceiptRecord> {
        self.receipts.get(&receipt_id).cloned()
    }

    /// PENDING → PROVED, once the verifier accepts the proof and the proved
    /// statement matches the receipt. Anyone may call it; attach about 70 Tgas.
    pub fn prove(
        &mut self,
        receipt_id: String,
        program: String,
        public_values: Base64VecU8,
        proof: Base64VecU8,
    ) -> Promise {
        let Some(verifier_account) = self.verifier.clone() else {
            env::panic_str("no verifier set");
        };
        let record = self.receipts.get(&receipt_id).unwrap_or_else(|| env::panic_str("receipt not found"));
        require!(record.state == ReceiptState::Pending, "receipt is not PENDING");
        verifier::ext(verifier_account)
            .with_static_gas(VERIFY_GAS)
            .verify(program, public_values, proof)
            .then(Self::ext(env::current_account_id()).with_static_gas(CALLBACK_GAS).on_verified(receipt_id))
    }

    #[private]
    pub fn on_verified(
        &mut self,
        receipt_id: String,
        #[callback_result] statement: Result<String, PromiseError>,
    ) -> ReceiptRecord {
        let statement = statement.unwrap_or_else(|_| env::panic_str("verifier rejected the proof"));
        let digest = hex(&env::sha256_array(statement.as_bytes()));
        let claim_hash = self.receipts.get(&receipt_id).map(|r| r.claim_hash.clone());
        require!(claim_hash.as_deref() == Some(digest.as_str()), "proof is for a different claim");
        let verifier_account = self.verifier.clone().map(|a| a.to_string()).unwrap_or_default();
        self.transition(receipt_id, ReceiptState::Proved, Some(format!("near:{verifier_account}:{digest}")), None)
    }

    /// PENDING → NON_PROVABLE.
    pub fn mark_non_provable(&mut self, receipt_id: String, note: Option<String>) -> ReceiptRecord {
        self.assert_owner();
        self.transition(receipt_id, ReceiptState::NonProvable, None, note)
    }

    /// PENDING|PROVED → INVALIDATED.
    pub fn invalidate(&mut self, receipt_id: String, note: Option<String>) -> ReceiptRecord {
        self.assert_owner();
        self.transition(receipt_id, ReceiptState::Invalidated, None, note)
    }

    pub fn event_count(&self) -> u64 {
        self.next_event
    }

    pub fn get_event(&self, index: u64) -> Option<ReceiptEvent> {
        self.events.get(&index).cloned()
    }
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

impl Receipts {
    fn assert_owner(&self) {
        require!(env::predecessor_account_id() == self.owner, "owner only");
    }

    fn transition(
        &mut self,
        receipt_id: String,
        to: ReceiptState,
        proof_ref: Option<String>,
        note: Option<String>,
    ) -> ReceiptRecord {
        let Some(current) = self.receipts.get(&receipt_id).cloned() else {
            env::panic_str("receipt not found");
        };
        require!(
            current.state.can_move_to(&to),
            &format!(
                "illegal receipt transition {} -> {}",
                current.state.as_str(),
                to.as_str()
            )
        );

        let from = current.state.clone();
        let mut next = current;
        next.state = to.clone();
        next.updated_at = env::block_timestamp();
        if let Some(proof_ref) = proof_ref {
            next.proof_ref = Some(proof_ref);
        }

        self.receipts.insert(receipt_id.clone(), next.clone());
        self.events.insert(
            self.next_event,
            ReceiptEvent {
                receipt_id,
                from_state: from,
                to_state: to,
                note,
                at: env::block_timestamp(),
            },
        );
        self.next_event += 1;
        next
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;

    const STATEMENT: &str = "swaraj/statement/private-mandate/v1\ndecision=ALLOW";

    fn as_caller(caller: usize) {
        let mut builder = VMContextBuilder::new();
        builder.current_account_id(accounts(0)).predecessor_account_id(accounts(caller));
        testing_env!(builder.build());
    }

    fn contract() -> Receipts {
        as_caller(0);
        let mut c = Receipts::new(None);
        c.set_verifier(accounts(3));
        c
    }

    fn claim(statement: &str) -> String {
        hex(&env::sha256_array(statement.as_bytes()))
    }

    fn create(c: &mut Receipts) -> ReceiptRecord {
        c.create_pending("receipt_1".into(), "app_demo".into(), "0xintent".into(), claim(STATEMENT))
    }

    /// What the verifier callback does after `prove`; runs as the contract itself.
    fn verified(c: &mut Receipts, statement: Result<&str, PromiseError>) -> ReceiptRecord {
        as_caller(0);
        c.on_verified("receipt_1".into(), statement.map(str::to_string))
    }

    #[test]
    fn create_pending_starts_in_pending() {
        let mut c = contract();
        let r = create(&mut c);
        assert_eq!(r.state, ReceiptState::Pending);
        assert!(r.proof_ref.is_none());
        assert_eq!(c.get("receipt_1".into()).unwrap().state, ReceiptState::Pending);
    }

    #[test]
    fn a_verified_matching_statement_proves_the_receipt() {
        let mut c = contract();
        create(&mut c);
        let r = verified(&mut c, Ok(STATEMENT));
        assert_eq!(r.state, ReceiptState::Proved);
        assert_eq!(r.proof_ref, Some(format!("near:{}:{}", accounts(3), claim(STATEMENT))));
        assert_eq!(c.event_count(), 1);
    }

    #[test]
    #[should_panic(expected = "verifier rejected the proof")]
    fn a_rejected_proof_leaves_the_receipt_pending() {
        let mut c = contract();
        create(&mut c);
        verified(&mut c, Err(PromiseError::Failed));
    }

    #[test]
    #[should_panic(expected = "proof is for a different claim")]
    fn a_valid_proof_of_another_statement_cannot_prove_it() {
        let mut c = contract();
        create(&mut c);
        verified(&mut c, Ok("swaraj/statement/private-mandate/v1\ndecision=OTHER"));
    }

    #[test]
    #[should_panic(expected = "receipt is not PENDING")]
    fn prove_refuses_a_receipt_that_is_not_pending() {
        let mut c = contract();
        create(&mut c);
        c.mark_non_provable("receipt_1".into(), None);
        as_caller(1);
        let _ = c.prove("receipt_1".into(), "0x00".into(), vec![].into(), vec![].into());
    }

    #[test]
    #[should_panic(expected = "no verifier set")]
    fn prove_needs_a_verifier() {
        as_caller(0);
        let mut c = Receipts::new(None);
        create(&mut c);
        let _ = c.prove("receipt_1".into(), "0x00".into(), vec![].into(), vec![].into());
    }

    #[test]
    fn anyone_may_ask_for_a_proof_check() {
        let mut c = contract();
        create(&mut c);
        as_caller(1);
        let _ = c.prove("receipt_1".into(), "0x00".into(), vec![].into(), vec![].into());
    }

    #[test]
    #[should_panic(expected = "owner only")]
    fn strangers_cannot_create_receipts() {
        let mut c = contract();
        as_caller(1);
        create(&mut c);
    }

    #[test]
    #[should_panic(expected = "owner only")]
    fn strangers_cannot_invalidate() {
        let mut c = contract();
        create(&mut c);
        as_caller(1);
        c.invalidate("receipt_1".into(), None);
    }

    #[test]
    #[should_panic(expected = "owner only")]
    fn strangers_cannot_mark_non_provable() {
        let mut c = contract();
        create(&mut c);
        as_caller(1);
        c.mark_non_provable("receipt_1".into(), None);
    }

    #[test]
    #[should_panic(expected = "owner only")]
    fn strangers_cannot_change_the_verifier() {
        let mut c = contract();
        as_caller(1);
        c.set_verifier(accounts(1));
    }

    #[test]
    #[should_panic(expected = "claim_hash must be lowercase hex SHA-256")]
    fn a_receipt_needs_a_real_claim_hash() {
        let mut c = contract();
        c.create_pending("receipt_1".into(), "app_demo".into(), "0xintent".into(), "0xclaim".into());
    }

    #[test]
    fn pending_to_non_provable_is_allowed() {
        let mut c = contract();
        create(&mut c);
        let r = c.mark_non_provable("receipt_1".into(), Some("missing evidence".into()));
        assert_eq!(r.state, ReceiptState::NonProvable);
    }

    #[test]
    fn pending_to_invalidated_is_allowed() {
        let mut c = contract();
        create(&mut c);
        let r = c.invalidate("receipt_1".into(), None);
        assert_eq!(r.state, ReceiptState::Invalidated);
    }

    #[test]
    fn proved_to_invalidated_is_allowed() {
        let mut c = contract();
        create(&mut c);
        verified(&mut c, Ok(STATEMENT));
        let r = c.invalidate("receipt_1".into(), Some("revoked".into()));
        assert_eq!(r.state, ReceiptState::Invalidated);
        assert_eq!(c.event_count(), 2);
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition PROVED -> PROVED")]
    fn proved_cannot_be_proved_again() {
        let mut c = contract();
        create(&mut c);
        verified(&mut c, Ok(STATEMENT));
        // Same-state updates are illegal (matches SQL guard).
        verified(&mut c, Ok(STATEMENT));
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition PROVED -> NON_PROVABLE")]
    fn proved_cannot_become_non_provable() {
        let mut c = contract();
        create(&mut c);
        verified(&mut c, Ok(STATEMENT));
        c.mark_non_provable("receipt_1".into(), None);
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition NON_PROVABLE -> PROVED")]
    fn non_provable_cannot_become_proved() {
        let mut c = contract();
        create(&mut c);
        c.mark_non_provable("receipt_1".into(), None);
        verified(&mut c, Ok(STATEMENT));
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition NON_PROVABLE -> INVALIDATED")]
    fn non_provable_cannot_be_invalidated() {
        let mut c = contract();
        create(&mut c);
        c.mark_non_provable("receipt_1".into(), None);
        c.invalidate("receipt_1".into(), None);
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition INVALIDATED -> PROVED")]
    fn invalidated_is_terminal() {
        let mut c = contract();
        create(&mut c);
        c.invalidate("receipt_1".into(), None);
        verified(&mut c, Ok(STATEMENT));
    }

    #[test]
    #[should_panic(expected = "receipt already exists")]
    fn duplicate_create_is_rejected() {
        let mut c = contract();
        create(&mut c);
        create(&mut c);
    }

    #[test]
    #[should_panic(expected = "receipt not found")]
    fn missing_receipt_cannot_be_proved() {
        let mut c = contract();
        as_caller(1);
        let _ = c.prove("missing".into(), "0x00".into(), vec![].into(), vec![].into());
    }
}
