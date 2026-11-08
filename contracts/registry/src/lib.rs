//! Agent registry on NEAR (Nov 8).
//!
//! An agent registers once under its NEAR account id; anyone can read the
//! record back. Updates are agent-only (predecessor must match `agent_id`).

use near_sdk::store::IterableMap;
use near_sdk::{env, near, require, AccountId, PanicOnDefault};

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct AgentRecord {
    pub agent_id: AccountId,
    pub display_name: String,
    pub metadata_uri: String,
    pub registered_at: u64,
    pub updated_at: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Registry {
    owner: AccountId,
    agents: IterableMap<AccountId, AgentRecord>,
}

#[near]
impl Registry {
    #[init]
    pub fn new() -> Self {
        Self {
            owner: env::predecessor_account_id(),
            agents: IterableMap::new(b"a"),
        }
    }

    pub fn owner(&self) -> AccountId {
        self.owner.clone()
    }

    /// Register the calling account as an agent. Panics if already registered.
    pub fn register(&mut self, display_name: String, metadata_uri: String) -> AgentRecord {
        let agent_id = env::predecessor_account_id();
        require!(!display_name.is_empty(), "empty display_name");
        require!(
            !self.agents.contains_key(&agent_id),
            "agent already registered"
        );
        let now = env::block_timestamp();
        let record = AgentRecord {
            agent_id: agent_id.clone(),
            display_name,
            metadata_uri,
            registered_at: now,
            updated_at: now,
        };
        self.agents.insert(agent_id, record.clone());
        record
    }

    /// Update display name / metadata. Only the registered agent may call.
    pub fn update(&mut self, display_name: String, metadata_uri: String) -> AgentRecord {
        let agent_id = env::predecessor_account_id();
        require!(!display_name.is_empty(), "empty display_name");
        let Some(mut record) = self.agents.get(&agent_id).cloned() else {
            env::panic_str("agent not registered");
        };
        record.display_name = display_name;
        record.metadata_uri = metadata_uri;
        record.updated_at = env::block_timestamp();
        self.agents.insert(agent_id, record.clone());
        record
    }

    pub fn get(&self, agent_id: AccountId) -> Option<AgentRecord> {
        self.agents.get(&agent_id).cloned()
    }

    pub fn is_registered(&self, agent_id: AccountId) -> bool {
        self.agents.contains_key(&agent_id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;

    fn as_caller(caller: usize) {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(accounts(caller));
        testing_env!(builder.build());
    }

    fn contract() -> Registry {
        as_caller(0);
        Registry::new()
    }

    #[test]
    fn register_then_get_round_trips() {
        let mut c = contract();
        as_caller(1);
        let registered = c.register("zunno-bot".into(), "near:agent/zunno".into());
        assert_eq!(registered.agent_id, accounts(1));
        assert_eq!(registered.display_name, "zunno-bot");

        let got = c.get(accounts(1)).expect("record");
        assert_eq!(got, registered);
        assert!(c.is_registered(accounts(1)));
        assert!(!c.is_registered(accounts(2)));
    }

    #[test]
    fn agent_can_update_own_record() {
        let mut c = contract();
        as_caller(1);
        c.register("zunno-bot".into(), "near:v1".into());
        let updated = c.update("zunno-bot-v2".into(), "near:v2".into());
        assert_eq!(updated.display_name, "zunno-bot-v2");
        assert_eq!(updated.metadata_uri, "near:v2");
        assert!(updated.updated_at >= updated.registered_at);
    }

    #[test]
    #[should_panic(expected = "agent already registered")]
    fn duplicate_register_is_rejected() {
        let mut c = contract();
        as_caller(1);
        c.register("a".into(), "u".into());
        c.register("b".into(), "u2".into());
    }

    #[test]
    #[should_panic(expected = "agent not registered")]
    fn stranger_cannot_update() {
        let mut c = contract();
        as_caller(1);
        c.register("a".into(), "u".into());
        as_caller(2);
        c.update("hijack".into(), "x".into());
    }

    #[test]
    #[should_panic(expected = "empty display_name")]
    fn empty_display_name_is_rejected() {
        let mut c = contract();
        as_caller(1);
        c.register("".into(), "u".into());
    }
}
