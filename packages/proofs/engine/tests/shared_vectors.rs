//! Shared gate vectors — the same JSON file the TypeScript gateway test
//! and the generated Lean examples consume. The engine must reproduce
//! every case's expected outcome and violated-rule list exactly.

use std::collections::BTreeMap;

use serde::Deserialize;
use swaraj_gate_engine::{decide, GroundBinding, PolicyDoc};

const VECTORS_JSON: &str = include_str!("../../vectors/gate-vectors.json");

#[derive(Deserialize)]
struct VectorFile {
    #[allow(dead_code)]
    domain: String,
    policies: BTreeMap<String, PolicyDoc>,
    cases: Vec<VectorCase>,
}

#[derive(Deserialize)]
struct VectorCase {
    #[allow(dead_code)]
    name: String,
    policy: String,
    action: GroundBinding,
    expect: Expectation,
}

#[derive(Deserialize)]
struct Expectation {
    outcome: String,
    violated: Vec<String>,
}

#[test]
fn shared_vectors_all_reproduced() {
    let file: VectorFile = serde_json::from_str(VECTORS_JSON).expect("vector file parses");
    assert_eq!(file.domain, "swaraj/gate-vectors/v1");
    assert!(file.cases.len() >= 5);

    for case in &file.cases {
        let policy = file
            .policies
            .get(&case.policy)
            .unwrap_or_else(|| panic!("case {} references unknown policy {}", case.name, case.policy));
        let decision = decide(policy, &case.action)
            .unwrap_or_else(|err| panic!("case {} failed to evaluate: {err}", case.name));
        let outcome = if decision.outcome == swaraj_gate_engine::Outcome::Allow {
            "ALLOW"
        } else {
            "BLOCK"
        };
        assert_eq!(
            outcome, case.expect.outcome,
            "case {}: outcome mismatch",
            case.name
        );
        assert_eq!(
            decision.violated, case.expect.violated,
            "case {}: violated rule mismatch",
            case.name
        );
    }
}

#[test]
fn vector_policy_fields_are_declared() {
    // Guard the wire shape: every field the bindings use must be declared
    // by the policy, or evaluation would fail closed in the guest.
    let file: VectorFile = serde_json::from_str(VECTORS_JSON).expect("vector file parses");
    for case in &file.cases {
        let policy = &file.policies[&case.policy];
        for name in case.action.values.keys() {
            assert!(
                policy.fields.contains(name),
                "case {}: field {name} used but not declared",
                case.name
            );
        }
    }
}

/// Wire-shape guard: the compound policy in the vector file exercises the
/// full term language, and the engine's serde tags deserialized it — so a
/// tag rename on either side breaks here, not in production.
#[test]
fn compound_policy_exercises_the_full_term_language() {
    let file: VectorFile = serde_json::from_str(VECTORS_JSON).expect("vector file parses");
    let policy = &file.policies["pol_vectors_compound"];
    assert!(policy.rules.len() >= 5, "compound policy should have five or more rules");
    let json = serde_json::to_string(policy).expect("policy serializes");
    for kind in [ "\"compare\"", "\"any\"", "\"implies\"", "\"not\"", "\"diff\"", "\"prod\"" ] {
        assert!(json.contains(kind), "compound policy should contain term kind {kind}");
    }
}
