use swaraj_gate_engine::{
    build_statement, canonical_text, decide, statement_id, GroundBinding, PolicyDoc,
};

const SAMPLE_POLICY_JSON: &str = r#"{
  "policyId": "pol_trade_demo",
  "revision": 3,
  "fields": ["amountCents", "limitCents", "dailyUsedCents", "dailyCapCents"],
  "assumptions": [
    { "ruleId": "limit.fixed",
      "assertion": { "kind": "compare", "op": "eq",
        "left": { "kind": "field", "name": "limitCents" },
        "right": { "kind": "const", "value": 100000 } } }
  ],
  "rules": [
    { "ruleId": "amount.positive",
      "assertion": { "kind": "compare", "op": "gt",
        "left": { "kind": "field", "name": "amountCents" },
        "right": { "kind": "const", "value": 0 } } },
    { "ruleId": "amount.cap",
      "assertion": { "kind": "compare", "op": "le",
        "left": { "kind": "field", "name": "amountCents" },
        "right": { "kind": "field", "name": "limitCents" } } },
    { "ruleId": "daily.budget",
      "assertion": { "kind": "compare", "op": "le",
        "left": { "kind": "sum", "parts": [
          { "kind": "field", "name": "dailyUsedCents" },
          { "kind": "field", "name": "amountCents" } ] },
        "right": { "kind": "field", "name": "dailyCapCents" } } }
  ]
}"#;

fn sample_action(amount: &str, daily_used: &str) -> GroundBinding {
    let mut values = std::collections::BTreeMap::new();
    values.insert("amountCents".to_string(), amount.to_string());
    values.insert("limitCents".to_string(), "100000".to_string());
    values.insert("dailyUsedCents".to_string(), daily_used.to_string());
    values.insert("dailyCapCents".to_string(), "500000".to_string());
    GroundBinding { values }
}

#[test]
fn wire_json_parses_into_the_engine_shapes() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).expect("policy json parses");
    assert_eq!(policy.policy_id, "pol_trade_demo");
    assert_eq!(policy.rules.len(), 3);
    assert_eq!(policy.revision, 3);
}

#[test]
fn in_policy_action_allows() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).unwrap();
    let decision = decide(&policy, &sample_action("25000", "0")).expect("evaluation succeeds");
    assert_eq!(decision.outcome, swaraj_gate_engine::Outcome::Allow);
    assert!(decision.violated.is_empty());
}

#[test]
fn over_cap_action_blocks_with_exact_rule_id() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).unwrap();
    let decision = decide(&policy, &sample_action("250000", "0")).expect("evaluation succeeds");
    assert_eq!(decision.outcome, swaraj_gate_engine::Outcome::Block);
    assert_eq!(decision.violated, vec!["amount.cap".to_string()]);
}

#[test]
fn daily_budget_rule_fires() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).unwrap();
    let decision = decide(&policy, &sample_action("20000", "490000")).expect("evaluation succeeds");
    assert_eq!(decision.violated, vec!["daily.budget".to_string()]);
}

#[test]
fn unknown_and_missing_fields_are_errors() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).unwrap();
    let mut binding = sample_action("1", "0");
    binding.values.insert("extra".to_string(), "1".to_string());
    assert!(decide(&policy, &binding).is_err());

    let mut missing = sample_action("1", "0");
    missing.values.remove("dailyUsedCents");
    assert!(decide(&policy, &missing).is_err());
}

#[test]
fn assumption_mismatch_is_an_error_not_a_block() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).unwrap();
    let mut binding = sample_action("25000", "0");
    binding.values.insert("limitCents".to_string(), "999".to_string());
    assert!(decide(&policy, &binding).is_err());
}

#[test]
fn statement_text_is_canonical_and_sorted() {
    let policy: PolicyDoc = serde_json::from_str(SAMPLE_POLICY_JSON).unwrap();
    let action = sample_action("25000", "0");
    let decision = decide(&policy, &action).unwrap();
    let statement = build_statement(&policy, &action, &decision, "pol_deadbeef");
    let text = canonical_text(&statement);
    let expected = "swaraj/statement/v1\n\
                    policy=pol_trade_demo\n\
                    revision=3\n\
                    digest=pol_deadbeef\n\
                    binding=amountCents:25000;dailyCapCents:500000;dailyUsedCents:0;limitCents:100000\n\
                    outcome=ALLOW\n\
                    violated=-";
    assert_eq!(text, expected);
    let id = statement_id(&statement);
    assert!(id.starts_with("stmt_"));
    assert_eq!(id.len(), "stmt_".len() + 64);
}
