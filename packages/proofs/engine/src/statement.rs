//! Canonical statement text and its SHA-256 statement id. Byte-identical
//! to the TypeScript implementation in packages/proofs/src/statement.ts —
//! both sides must derive the same id from the same inputs.

use crate::gate::{Decision, Outcome};
use crate::wire::{GroundBinding, PolicyDoc};
use sha2::{Digest, Sha256};

pub const STATEMENT_DOMAIN: &str = "swaraj/statement/v1";

pub struct Statement {
    pub policy_id: String,
    pub revision: i64,
    pub policy_doc_digest: String,
    pub binding: Vec<(String, String)>,
    pub outcome: Outcome,
    pub violated: Vec<String>,
}

pub fn build_statement(
    policy: &PolicyDoc,
    action: &GroundBinding,
    decision: &Decision,
    policy_doc_digest: &str,
) -> Statement {
    let mut binding: Vec<(String, String)> = policy
        .fields
        .iter()
        .map(|name| {
            (
                name.clone(),
                action.values.get(name).cloned().unwrap_or_default(),
            )
        })
        .collect();
    binding.sort_by(|a, b| a.0.cmp(&b.0));

    let mut violated = decision.violated.clone();
    violated.sort();

    Statement {
        policy_id: policy.policy_id.clone(),
        revision: policy.revision,
        policy_doc_digest: policy_doc_digest.to_string(),
        binding,
        outcome: decision.outcome.clone(),
        violated,
    }
}

pub fn canonical_text(statement: &Statement) -> String {
    let binding = statement
        .binding
        .iter()
        .map(|(name, value)| format!("{name}:{value}"))
        .collect::<Vec<_>>()
        .join(";");
    let violated = if statement.violated.is_empty() {
        "-".to_string()
    } else {
        statement.violated.join(",")
    };
    [
        STATEMENT_DOMAIN.to_string(),
        format!("policy={}", statement.policy_id),
        format!("revision={}", statement.revision),
        format!("digest={}", statement.policy_doc_digest),
        format!("binding={binding}"),
        format!("outcome={}", statement.outcome.as_str()),
        format!("violated={violated}"),
    ]
    .join("\n")
}

pub fn statement_id(statement: &Statement) -> String {
    let digest = Sha256::digest(canonical_text(statement).as_bytes());
    format!("stmt_{}", hex(&digest))
}

pub fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}
