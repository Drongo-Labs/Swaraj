//! On-chain receipt lifecycle for Swaraj.
//!
//! Mirrors `packages/database/migrations/0002-receipts.sql`:
//!   PENDING → {PROVED, NON_PROVABLE, INVALIDATED}
//!   PROVED  → {INVALIDATED}
//! Every other move panics. PROVED still requires a `proof_ref` (Nov 8 will
//! call Ayush's verifier before this transition is allowed in production).

use near_sdk::store::IterableMap;
use near_sdk::{env, near, require, AccountId, PanicOnDefault};

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
    /// Opaque claim digest (hex). Full claim stays off-chain for now.
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

    /// Create a PENDING receipt. Same `receipt_id` twice panics (idempotent create is explicit).
    pub fn create_pending(
        &mut self,
        receipt_id: String,
        app_id: String,
        intent_digest: String,
        claim_hash: String,
    ) -> ReceiptRecord {
        require!(!receipt_id.is_empty(), "empty receipt_id");
        require!(!app_id.is_empty(), "empty app_id");
        require!(!intent_digest.is_empty(), "empty intent_digest");
        require!(!claim_hash.is_empty(), "empty claim_hash");
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

    /// PENDING → PROVED. Requires a non-empty proof_ref (verifier check lands Nov 8).
    pub fn mark_proved(&mut self, receipt_id: String, proof_ref: String) -> ReceiptRecord {
        require!(!proof_ref.is_empty(), "proof_ref required for PROVED");
        self.transition(receipt_id, ReceiptState::Proved, Some(proof_ref), None)
    }

    /// PENDING → NON_PROVABLE.
    pub fn mark_non_provable(&mut self, receipt_id: String, note: Option<String>) -> ReceiptRecord {
        self.transition(receipt_id, ReceiptState::NonProvable, None, note)
    }

    /// PENDING|PROVED → INVALIDATED.
    pub fn invalidate(&mut self, receipt_id: String, note: Option<String>) -> ReceiptRecord {
        self.transition(receipt_id, ReceiptState::Invalidated, None, note)
    }

    pub fn event_count(&self) -> u64 {
        self.next_event
    }

    pub fn get_event(&self, index: u64) -> Option<ReceiptEvent> {
        self.events.get(&index).cloned()
    }
}

impl Receipts {
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

    fn context() {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(accounts(0));
        testing_env!(builder.build());
    }

    fn contract() -> Receipts {
        context();
        Receipts::new(None)
    }

    fn create(c: &mut Receipts) -> ReceiptRecord {
        c.create_pending(
            "receipt_1".into(),
            "app_demo".into(),
            "0xintent".into(),
            "0xclaim".into(),
        )
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
    fn pending_to_proved_is_allowed_with_proof_ref() {
        let mut c = contract();
        create(&mut c);
        let r = c.mark_proved("receipt_1".into(), "near:tx:abc".into());
        assert_eq!(r.state, ReceiptState::Proved);
        assert_eq!(r.proof_ref.as_deref(), Some("near:tx:abc"));
        assert_eq!(c.event_count(), 1);
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
        c.mark_proved("receipt_1".into(), "near:tx:abc".into());
        let r = c.invalidate("receipt_1".into(), Some("revoked".into()));
        assert_eq!(r.state, ReceiptState::Invalidated);
        assert_eq!(c.event_count(), 2);
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition PROVED -> PROVED")]
    fn proved_cannot_be_proved_again() {
        let mut c = contract();
        create(&mut c);
        c.mark_proved("receipt_1".into(), "near:tx:abc".into());
        // Same-state updates are illegal (matches SQL guard).
        c.mark_proved("receipt_1".into(), "near:tx:def".into());
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition PROVED -> NON_PROVABLE")]
    fn proved_cannot_become_non_provable() {
        let mut c = contract();
        create(&mut c);
        c.mark_proved("receipt_1".into(), "near:tx:abc".into());
        c.mark_non_provable("receipt_1".into(), None);
    }

    #[test]
    #[should_panic(expected = "illegal receipt transition NON_PROVABLE -> PROVED")]
    fn non_provable_cannot_become_proved() {
        let mut c = contract();
        create(&mut c);
        c.mark_non_provable("receipt_1".into(), None);
        c.mark_proved("receipt_1".into(), "near:tx:abc".into());
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
        c.mark_proved("receipt_1".into(), "near:tx:abc".into());
    }

    #[test]
    #[should_panic(expected = "proof_ref required for PROVED")]
    fn proved_requires_proof_ref() {
        let mut c = contract();
        create(&mut c);
        c.mark_proved("receipt_1".into(), "".into());
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
    fn missing_receipt_cannot_transition() {
        let mut c = contract();
        c.mark_proved("missing".into(), "near:tx:abc".into());
    }
}
