//! SP1 guest: proves that the deterministic gate re-evaluation of a
//! committed policy over a committed action produced the recorded
//! decision, and commits to the resulting statement id. Every input is
//! a commitment provided by the host; the guest recomputes everything.

use serde::{Deserialize, Serialize};
use swaraj_gate_engine::{
    build_statement, canonical_text, decide, statement_id, GroundBinding, PolicyDoc, Statement,
};

#[derive(Serialize, Deserialize)]
struct GateInput {
    policy: PolicyDoc,
    action: GroundBinding,
    policy_doc_digest: String,
    expected_statement_id: String,
}

sp1_zkvm::entrypoint!(main);

fn main() {
    let raw = sp1_zkvm::io::read_vec();
    let input: GateInput = serde_json::from_slice(&raw).expect("gate input json parses");

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
