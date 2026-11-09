//! Mandate decision guest: proves the decision an Agent Mandate gives an
//! action, ALLOW, BLOCK or NEEDS_APPROVAL, with the rules that decided it.
//! Unlike the Private Mandate guest it never aborts on a refusal, so a blocked
//! action gets a proof too. The mandate is public: only its hash is committed.
//! Parity: scripts/private-mandate.test.ts.

#![no_main]

#[path = "../../private-guest/src/mandate.rs"]
mod mandate;

use serde_json::Value;

sp1_zkvm::entrypoint!(main);

fn main() {
    let raw = sp1_zkvm::io::read_vec();
    let input: Value = serde_json::from_slice(&raw).expect("input parses");
    let mandate_json = input["mandateJson"].as_str().expect("mandateJson");
    let action_json = input["actionJson"].as_str().expect("actionJson");
    let mandate: Value = serde_json::from_str(mandate_json).expect("mandate parses");
    let action: Value = serde_json::from_str(action_json).expect("action parses");

    let (decision, mut matched) = mandate::decide(&mandate, &action);
    matched.sort();
    let matched = if matched.is_empty() { "-".to_string() } else { matched.join(",") };
    let mut statement = format!(
        "swaraj/statement/mandate-decision/v1\nmandate={}\naction={}\ndecision={decision}\nmatched={matched}",
        mandate::sha256_hex(&[mandate_json.as_bytes()]),
        mandate::sha256_hex(&[action_json.as_bytes()]),
    );
    // Evidence of the executed action, bound as given.
    if let Some(evidence) = input["evidenceDigest"].as_str() {
        statement.push_str(&format!("\nevidence={evidence}"));
    }
    sp1_zkvm::io::commit(&statement);
}
