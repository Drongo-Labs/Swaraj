//! Wager escrow for Zunno. Agents deposit FT (or native NEAR when `ft_contract`
//! is None) up to `max_wager`; over-limit deposits panic.
//!
//! The pot pays out only on a PROVED receipt: the receipts contract must hold a
//! receipt, verified by the Groth16 verifier, whose statement is an ALLOW of a
//! `payout` APP_ACTION naming this escrow, the winner and the exact pot. Not even
//! the owner can pay without one. Each receipt pays once. The owner can refund
//! a single wager on cancel.

use near_sdk::json_types::U128;
use near_sdk::serde_json::Value;
use near_sdk::store::{IterableMap, LookupSet};
use near_sdk::{
    env, ext_contract, near, require, AccountId, Gas, NearToken, PanicOnDefault, Promise, PromiseError,
};

const FT_GAS: Gas = Gas::from_tgas(30);
const GET_GAS: Gas = Gas::from_tgas(10);
const CALLBACK_GAS: Gas = Gas::from_tgas(40);

/// The fields of a receipts-contract record this escrow needs.
#[near(serializers = [json])]
pub struct ProvedReceipt {
    pub state: String,
    pub claim_hash: String,
}

#[ext_contract(receipts_contract)]
#[allow(dead_code)]
trait Receipts {
    fn get(&self, receipt_id: String) -> Option<ProvedReceipt>;
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct WagerRecord {
    pub agent_id: AccountId,
    pub amount: U128,
    pub deposited_at: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct WagerEscrow {
    owner: AccountId,
    /// Optional NEP-141 contract. `None` = native NEAR deposits.
    ft_contract: Option<AccountId>,
    max_wager: u128,
    wagers: IterableMap<AccountId, WagerRecord>,
    /// The receipts contract whose PROVED receipts authorize payouts.
    receipts: AccountId,
    used_receipts: LookupSet<String>,
}

#[near]
impl WagerEscrow {
    #[init]
    pub fn new(ft_contract: Option<AccountId>, max_wager: U128, receipts: AccountId) -> Self {
        require!(max_wager.0 > 0, "max_wager must be positive");
        Self {
            owner: env::predecessor_account_id(),
            ft_contract,
            max_wager: max_wager.0,
            wagers: IterableMap::new(b"w"),
            receipts,
            used_receipts: LookupSet::new(b"u"),
        }
    }

    pub fn receipts(&self) -> AccountId {
        self.receipts.clone()
    }

    pub fn owner(&self) -> AccountId {
        self.owner.clone()
    }

    pub fn max_wager(&self) -> U128 {
        U128(self.max_wager)
    }

    pub fn ft_contract(&self) -> Option<AccountId> {
        self.ft_contract.clone()
    }

    pub fn get_wager(&self, agent_id: AccountId) -> Option<WagerRecord> {
        self.wagers.get(&agent_id).cloned()
    }

    /// Native NEAR deposit. Panics if over max or FT mode is configured.
    #[payable]
    pub fn deposit_near(&mut self) -> WagerRecord {
        require!(self.ft_contract.is_none(), "use FT deposit for this escrow");
        let agent = env::predecessor_account_id();
        let amount = env::attached_deposit().as_yoctonear();
        self.record_deposit(agent, amount)
    }

    /// Record an FT deposit after `ft_transfer_call`. Only the FT contract may call.
    pub fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, _msg: String) -> U128 {
        let ft = self.ft_contract.clone().unwrap_or_else(|| env::panic_str("FT not configured"));
        require!(env::predecessor_account_id() == ft, "only FT contract");
        self.record_deposit(sender_id, amount.0);
        U128(0) // accept full amount
    }

    /// Pays the pot to `winner` once `receipt_id` is PROVED for this exact payout.
    /// Anyone may call it: the proof, not the caller, authorizes the payout.
    pub fn payout(&mut self, winner: AccountId, receipt_id: String, statement: String, action_wire: String) -> Promise {
        require!(!self.used_receipts.contains(&receipt_id), "receipt already paid out");
        receipts_contract::ext(self.receipts.clone())
            .with_static_gas(GET_GAS)
            .get(receipt_id.clone())
            .then(
                Self::ext(env::current_account_id())
                    .with_static_gas(CALLBACK_GAS)
                    .on_receipt(winner, receipt_id, statement, action_wire),
            )
    }

    #[private]
    pub fn on_receipt(
        &mut self,
        winner: AccountId,
        receipt_id: String,
        statement: String,
        action_wire: String,
        #[callback_result] receipt: Result<Option<ProvedReceipt>, PromiseError>,
    ) -> Promise {
        let receipt = receipt.ok().flatten().unwrap_or_else(|| env::panic_str("receipt not found"));
        require!(receipt.state == "Proved", "receipt is not PROVED");
        require!(receipt.claim_hash == hex(&env::sha256_array(statement.as_bytes())), "statement does not match the receipt");
        require!(!self.used_receipts.contains(&receipt_id), "receipt already paid out");
        let total = self.pot();
        require!(total > 0, "no wagers");
        if let Err(reason) = payout_authorized(&statement, &action_wire, &env::current_account_id(), &winner, total) {
            env::panic_str(reason);
        }
        self.used_receipts.insert(receipt_id);
        let keys: Vec<AccountId> = self.wagers.keys().cloned().collect();
        for key in keys {
            self.wagers.remove(&key);
        }
        self.transfer_out(winner, total)
    }

    /// Owner refunds a single agent's wager (match cancel).
    pub fn refund(&mut self, agent_id: AccountId) -> Promise {
        self.assert_owner();
        let Some(wager) = self.wagers.remove(&agent_id) else {
            env::panic_str("no wager");
        };
        self.transfer_out(agent_id, wager.amount.0)
    }
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

/// The proved statement must ALLOW exactly this payout: same action bytes
/// (intent hash), from this escrow, to this winner, for the whole pot.
fn payout_authorized(
    statement: &str,
    action_wire: &str,
    escrow: &AccountId,
    winner: &AccountId,
    pot: u128,
) -> Result<(), &'static str> {
    let line = |key: &str| statement.lines().find_map(|l| l.strip_prefix(key));
    if statement.lines().next() != Some("swaraj/statement/mandate/v1") {
        return Err("not a mandate statement");
    }
    if line("decision=") != Some("ALLOW") {
        return Err("the mandate did not allow this payout");
    }
    if line("intent=") != Some(&format!("0x{}", hex(&env::sha256_array(action_wire.as_bytes())))) {
        return Err("action does not match the proved intent");
    }
    let action: Value = near_sdk::serde_json::from_str(action_wire).map_err(|_| "action is not JSON")?;
    if action["action"] != "APP_ACTION" || action["context"]["name"] != "payout" {
        return Err("action is not a payout");
    }
    if action["resource"]["target"] != escrow.as_str() {
        return Err("payout is for another escrow");
    }
    let params = &action["context"]["params"];
    if params["winner"] != winner.as_str() {
        return Err("payout names another winner");
    }
    if params["amount"] != pot.to_string().as_str() {
        return Err("payout amount is not the pot");
    }
    Ok(())
}

impl WagerEscrow {
    fn pot(&self) -> u128 {
        self.wagers.values().fold(0u128, |sum, w| sum.saturating_add(w.amount.0))
    }

    fn assert_owner(&self) {
        require!(env::predecessor_account_id() == self.owner, "owner only");
    }

    fn record_deposit(&mut self, agent: AccountId, amount: u128) -> WagerRecord {
        require!(amount > 0, "zero deposit");
        require!(amount <= self.max_wager, "wager over max");
        require!(!self.wagers.contains_key(&agent), "already wagered");
        let record = WagerRecord {
            agent_id: agent.clone(),
            amount: U128(amount),
            deposited_at: env::block_timestamp(),
        };
        self.wagers.insert(agent, record.clone());
        record
    }

    fn transfer_out(&self, to: AccountId, amount: u128) -> Promise {
        if let Some(ft) = &self.ft_contract {
            #[near(serializers = [json])]
            #[derive(Clone)]
            struct FtTransferArgs {
                receiver_id: AccountId,
                amount: U128,
                memo: Option<String>,
            }
            Promise::new(ft.clone()).function_call(
                "ft_transfer".to_string(),
                near_sdk::serde_json::to_vec(&FtTransferArgs {
                    receiver_id: to,
                    amount: U128(amount),
                    memo: Some("zunno-payout".into()),
                })
                .unwrap(),
                NearToken::from_yoctonear(1),
                FT_GAS,
            )
        } else {
            Promise::new(to).transfer(NearToken::from_yoctonear(amount))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::{testing_env, NearToken};

    fn context(predecessor: usize, deposit: u128) {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(escrow())
            .predecessor_account_id(accounts(predecessor))
            .attached_deposit(NearToken::from_yoctonear(deposit));
        testing_env!(builder.build());
    }

    fn contract(max: u128) -> WagerEscrow {
        context(0, 0);
        WagerEscrow::new(None, U128(max), "receipts.testnet".parse().unwrap())
    }

    #[test]
    fn deposit_within_max_is_recorded() {
        let mut c = contract(1_000);
        context(1, 500);
        let w = c.deposit_near();
        assert_eq!(w.amount.0, 500);
        assert_eq!(c.get_wager(accounts(1)).unwrap().amount.0, 500);
    }

    #[test]
    #[should_panic(expected = "wager over max")]
    fn deposit_over_max_is_blocked() {
        let mut c = contract(1_000);
        context(1, 1_001);
        c.deposit_near();
    }

    #[test]
    #[should_panic(expected = "already wagered")]
    fn double_deposit_is_blocked() {
        let mut c = contract(1_000);
        context(1, 100);
        c.deposit_near();
        context(1, 100);
        c.deposit_near();
    }

    /// The escrow's own account in unit tests.
    fn escrow() -> AccountId {
        "escrow.testnet".parse().unwrap()
    }

    fn action(winner: &str, amount: &str, target: &str) -> String {
        format!(
            r#"{{"action":"APP_ACTION","resource":{{"app":"zunno","target":"{target}"}},"context":{{"name":"payout","params":{{"amount":"{amount}","winner":"{winner}"}}}}}}"#
        )
    }

    fn statement(action_wire: &str, decision: &str) -> String {
        format!(
            "swaraj/statement/mandate/v1\nintent=0x{}\nmandate=0xm\ndecision={decision}\nmatched=permit_payout",
            hex(&env::sha256_array(action_wire.as_bytes()))
        )
    }

    fn proved(statement: &str) -> Result<Option<ProvedReceipt>, PromiseError> {
        Ok(Some(ProvedReceipt { state: "Proved".into(), claim_hash: hex(&env::sha256_array(statement.as_bytes())) }))
    }

    /// Two wagers of 100 each, so the pot is 200.
    fn funded() -> WagerEscrow {
        let mut c = contract(1_000);
        context(1, 100);
        c.deposit_near();
        context(2, 100);
        c.deposit_near();
        context(0, 0);
        c
    }

    fn settle(c: &mut WagerEscrow, winner: usize, action_wire: &str, statement: &str, receipt: Result<Option<ProvedReceipt>, PromiseError>) {
        context(0, 0);
        let _ = c.on_receipt(accounts(winner), "r1".into(), statement.into(), action_wire.into(), receipt);
    }

    #[test]
    fn a_proved_payout_pays_the_pot_once() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let stmt = statement(&wire, "ALLOW");
        settle(&mut c, 1, &wire, &stmt, proved(&stmt));
        assert!(c.get_wager(accounts(1)).is_none() && c.get_wager(accounts(2)).is_none());
        assert!(c.used_receipts.contains(&"r1".to_string()));
    }

    #[test]
    #[should_panic(expected = "receipt already paid out")]
    fn a_receipt_cannot_pay_twice() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let stmt = statement(&wire, "ALLOW");
        settle(&mut c, 1, &wire, &stmt, proved(&stmt));
        let _ = c.payout(accounts(1), "r1".into(), stmt, wire);
    }

    #[test]
    #[should_panic(expected = "receipt is not PROVED")]
    fn a_pending_receipt_pays_nothing() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let stmt = statement(&wire, "ALLOW");
        let pending = Ok(Some(ProvedReceipt { state: "Pending".into(), claim_hash: hex(&env::sha256_array(stmt.as_bytes())) }));
        settle(&mut c, 1, &wire, &stmt, pending);
    }

    #[test]
    #[should_panic(expected = "receipt not found")]
    fn a_missing_receipt_pays_nothing() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        settle(&mut c, 1, &wire, &statement(&wire, "ALLOW"), Ok(None));
    }

    #[test]
    #[should_panic(expected = "statement does not match the receipt")]
    fn a_statement_the_receipt_did_not_prove_pays_nothing() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let other = statement(&action(accounts(2).as_str(), "200", escrow().as_str()), "ALLOW");
        settle(&mut c, 1, &wire, &statement(&wire, "ALLOW"), proved(&other));
    }

    #[test]
    #[should_panic(expected = "the mandate did not allow this payout")]
    fn a_proved_block_pays_nothing() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let stmt = statement(&wire, "BLOCK");
        settle(&mut c, 1, &wire, &stmt, proved(&stmt));
    }

    #[test]
    #[should_panic(expected = "action does not match the proved intent")]
    fn a_different_action_pays_nothing() {
        let mut c = funded();
        let proved_wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let stmt = statement(&proved_wire, "ALLOW");
        let swapped = action(accounts(2).as_str(), "200", escrow().as_str());
        settle(&mut c, 2, &swapped, &stmt, proved(&stmt));
    }

    #[test]
    #[should_panic(expected = "payout names another winner")]
    fn the_winner_must_match_the_proof() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", escrow().as_str());
        let stmt = statement(&wire, "ALLOW");
        settle(&mut c, 2, &wire, &stmt, proved(&stmt));
    }

    #[test]
    #[should_panic(expected = "payout amount is not the pot")]
    fn the_amount_must_be_the_whole_pot() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "150", escrow().as_str());
        let stmt = statement(&wire, "ALLOW");
        settle(&mut c, 1, &wire, &stmt, proved(&stmt));
    }

    #[test]
    #[should_panic(expected = "payout is for another escrow")]
    fn a_proof_for_another_escrow_pays_nothing() {
        let mut c = funded();
        let wire = action(accounts(1).as_str(), "200", "other-escrow.testnet");
        let stmt = statement(&wire, "ALLOW");
        settle(&mut c, 1, &wire, &stmt, proved(&stmt));
    }

    #[test]
    fn owner_can_refund() {
        let mut c = contract(1_000);
        context(1, 100);
        c.deposit_near();
        context(0, 0);
        let _ = c.refund(accounts(1));
        assert!(c.get_wager(accounts(1)).is_none());
    }
}
