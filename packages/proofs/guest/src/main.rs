//! SP1 guest: re-evaluates the gate over committed inputs and commits the statement id.

#![no_main]

use serde::{Deserialize, Serialize};
use swaraj_gate_engine::{
    build_statement, canonical_text, decide, statement_id, GroundBinding, PolicyDoc, Statement,
};

#[derive(Serialize, Deserialize)]
struct GateInput {
    policy: PolicyDoc,
    action: GroundBinding,
    #[serde(rename = "policyDocDigest")]
    policy_doc_digest: String,
    #[serde(rename = "expectedStatementId")]
    expected_statement_id: String,
}

sp1_zkvm::entrypoint!(main);

fn main() {
    let raw = sp1_zkvm::io::read_vec();
    let input: GateInput = match serde_json::from_slice(&raw) {
        Ok(parsed) => parsed,
        Err(err) => panic!("gate input parse failed: {err}; raw len {}", raw.len()),
    };

    let decision = decide(&input.policy, &input.action).expect("gate re-evaluation succeeds");
    let statement: Statement = build_statement(
        &input.policy,
        &input.action,
        &decision,
        &input.policy_doc_digest,
    );
    let computed_id = statement_id(&statement);

    // The proof only exists if the recomputed statement matches the one
    // recorded when the action was submitted. Any mismatch aborts here.
    assert_eq!(
        computed_id, input.expected_statement_id,
        "statement id mismatch: recorded {}",
        input.expected_statement_id
    );

    sp1_zkvm::io::commit(&computed_id);
    sp1_zkvm::io::commit(&canonical_text(&statement));
}
