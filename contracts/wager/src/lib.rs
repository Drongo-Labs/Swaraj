//! NEP-141 wager escrow for Zunno (Nov 9).
//!
//! Agents deposit FT (or native NEAR when `ft_contract` is None) up to
//! `max_wager`. Over-limit deposits panic. The owner settles a match with
//! `payout` to the winner (or `refund` on cancel).

use near_sdk::json_types::U128;
use near_sdk::store::IterableMap;
use near_sdk::{
    env, near, require, AccountId, Gas, NearToken, PanicOnDefault, Promise,
};

const FT_GAS: Gas = Gas::from_tgas(30);

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
}

#[near]
impl WagerEscrow {
    #[init]
    pub fn new(ft_contract: Option<AccountId>, max_wager: U128) -> Self {
        require!(max_wager.0 > 0, "max_wager must be positive");
        Self {
            owner: env::predecessor_account_id(),
            ft_contract,
            max_wager: max_wager.0,
            wagers: IterableMap::new(b"w"),
        }
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

    /// Owner pays the pot to `winner` (sum of both wagers, or the single wager).
    pub fn payout(&mut self, winner: AccountId) -> Promise {
        self.assert_owner();
        let mut total: u128 = 0;
        let keys: Vec<AccountId> = self.wagers.keys().cloned().collect();
        for key in &keys {
            if let Some(w) = self.wagers.get(key) {
                total = total.saturating_add(w.amount.0);
            }
        }
        require!(total > 0, "no wagers");
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

impl WagerEscrow {
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
            .predecessor_account_id(accounts(predecessor))
            .attached_deposit(NearToken::from_yoctonear(deposit));
        testing_env!(builder.build());
    }

    fn contract(max: u128) -> WagerEscrow {
        context(0, 0);
        WagerEscrow::new(None, U128(max))
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

    #[test]
    #[should_panic(expected = "owner only")]
    fn stranger_cannot_payout() {
        let mut c = contract(1_000);
        context(1, 100);
        c.deposit_near();
        context(2, 0);
        let _ = c.payout(accounts(1));
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
