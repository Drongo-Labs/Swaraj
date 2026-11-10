//! Mandate decision guest: proves the decision an Agent Mandate gives an
//! action, ALLOW, BLOCK or NEEDS_APPROVAL, with the rules that decided it.
//! Unlike the Private Mandate guest it never aborts on a refusal, so a blocked
//! action gets a proof too. The mandate is public: only its hash is committed.
//!
//! The guest is handed the exact canonical bytes TypeScript hashed, not raw
//! JSON, because the intent and mandate hashes depend on the TS serializers.
//! Input:
//!   actionWire        = serializeUnifiedAction(action)
//!   mandateCanonical  = canonicalize(stripSelfFields("POLICY_PROFILE", mandate))
//!   approvedBy?       = approver of a NEEDS_APPROVAL decision (required then)
//!   evidenceDigest?   = evidence root of the executed action
//! It commits the swaraj/statement/mandate/v1 text exactly as
//! canonicalMandateStatementText builds it.
//! Parity: scripts/private-mandate.test.ts.

#![no_main]

#[path = "../../private-guest/src/mandate.rs"]
mod mandate;

use serde_json::Value;
use sha3::{Digest as _, Keccak256};

sp1_zkvm::entrypoint!(main);

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}

/// keccak256("swaraj.v1.POLICY_PROFILE" || 0x00 || mandateCanonical), 0x-prefixed — matches hashObject in @swaraj/crypto.
fn mandate_hash(mandate_canonical: &str) -> String {
    let mut hasher = Keccak256::new();
    hasher.update(b"swaraj.v1.POLICY_PROFILE");
    hasher.update([0u8]);
    hasher.update(mandate_canonical.as_bytes());
    format!("0x{}", hex(&hasher.finalize()))
}

fn main() {
    let raw = sp1_zkvm::io::read_vec();
    let input: Value = serde_json::from_slice(&raw).expect("input parses");
    let action_wire = input["actionWire"].as_str().expect("actionWire");
    let mandate_canonical = input["mandateCanonical"].as_str().expect("mandateCanonical");
    let action: Value = serde_json::from_str(action_wire).expect("action parses");
    let mandate: Value = serde_json::from_str(mandate_canonical).expect("mandate parses");

    let approved_by = input.get("approvedBy").and_then(Value::as_str);
    let (decision, mut matched) = mandate::decide(&mandate, &action);
    if decision == "NEEDS_APPROVAL" && approved_by.is_none() {
        panic!("NEEDS_APPROVAL without an approver cannot be proved");
    }
    matched.sort();
    let matched = if matched.is_empty() { "-".to_string() } else { matched.join(",") };

    let intent = format!("0x{}", mandate::sha256_hex(&[action_wire.as_bytes()]));
    let mut statement = format!(
        "swaraj/statement/mandate/v1\nintent={intent}\nmandate={}\ndecision={decision}\nmatched={matched}",
        mandate_hash(mandate_canonical),
    );
    // The approver and evidence are bound as given, only when present.
    if let Some(approver) = approved_by {
        statement.push_str(&format!("\napproved_by={approver}"));
    }
    if let Some(evidence) = input["evidenceDigest"].as_str() {
        statement.push_str(&format!("\nevidence={evidence}"));
    }
    sp1_zkvm::io::commit(&statement);
}
