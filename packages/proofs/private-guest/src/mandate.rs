//! Agent Mandate evaluation shared by the SP1 guests. The vectors in
//! scripts/private-mandate.test.ts hold it to @swaraj/rules.

use serde_json::Value;
use sha2::{Digest, Sha256};

pub fn sha256_hex(parts: &[&[u8]]) -> String {
    let mut hasher = Sha256::new();
    for part in parts {
        hasher.update(part);
    }
    hasher.finalize().iter().map(|byte| format!("{byte:02x}")).collect()
}

fn is_digits(text: &str) -> bool {
    !text.is_empty() && text.bytes().all(|byte| byte.is_ascii_digit())
}

/// Decimal text of an integer value, whether the wire carries a number or a digit string.
fn integer_text(value: &Value) -> Option<String> {
    match value {
        Value::Number(number) => number.as_u64().map(|n| n.to_string()),
        Value::String(text) if is_digits(text) => {
            let trimmed = text.trim_start_matches('0');
            Some(if trimmed.is_empty() { "0".to_string() } else { trimmed.to_string() })
        }
        _ => None,
    }
}

fn compare(left: &str, right: &str) -> std::cmp::Ordering {
    left.len().cmp(&right.len()).then_with(|| left.cmp(right))
}

fn field_value<'a>(action: &'a Value, predicate: &Value) -> Option<&'a Value> {
    let field = predicate["field"].as_str()?;
    if field.starts_with("context.param") {
        let value = action["context"]["params"].get(predicate["name"].as_str()?)?;
        let is_integer = value.as_str().is_some_and(is_digits);
        return match field {
            "context.param" if is_integer => Some(value),
            "context.paramString" if value.is_string() && !is_integer => Some(value),
            "context.paramBool" if value.is_boolean() => Some(value),
            _ => None,
        };
    }
    match field.split_once('.') {
        Some((section, key)) => action.get(section)?.get(key),
        None => action.get(field),
    }
}

fn predicate_matches(action: &Value, predicate: &Value) -> bool {
    let Some(actual) = field_value(action, predicate) else { return false };
    let operator = predicate["operator"].as_str().unwrap_or("");
    if operator == "IN" {
        return predicate["values"].as_array().is_some_and(|values| values.contains(actual));
    }
    let expected = &predicate["value"];
    if let (Some(left), Some(right)) = (integer_text(actual), integer_text(expected)) {
        let order = compare(&left, &right);
        return match operator {
            "EQ" => order.is_eq(),
            "LT" => order.is_lt(),
            "LTE" => order.is_le(),
            "GT" => order.is_gt(),
            "GTE" => order.is_ge(),
            _ => false,
        };
    }
    operator == "EQ" && actual == expected
}

fn rule_matches(action: &Value, rule: &Value) -> bool {
    rule["action"] == action["action"]
        && rule["predicates"]
            .as_array()
            .is_some_and(|predicates| predicates.iter().all(|predicate| predicate_matches(action, predicate)))
}

/// Mirrors `evaluateParsedMandate` in @swaraj/rules: FORBID wins, then
/// REQUIRE_APPROVAL, then PERMIT, and no match is BLOCK. Returns the decision
/// and the ids of the rules that decided it, in mandate order.
pub fn decide(mandate: &Value, action: &Value) -> (&'static str, Vec<String>) {
    let timestamp = action["timestamp"].as_u64().expect("action timestamp");
    let from = mandate["validFrom"].as_u64().expect("validFrom");
    let until = mandate["validUntil"].as_u64().expect("validUntil");
    if timestamp < from || timestamp >= until {
        return ("BLOCK", Vec::new());
    }
    if mandate["agent"] != "*" && mandate["agent"] != action["agent"] {
        return ("BLOCK", Vec::new());
    }
    let rules = mandate["rules"].as_array().expect("mandate rules");
    let matching: Vec<&Value> = rules.iter().filter(|rule| rule_matches(action, rule)).collect();
    let ids = |effect: &str| -> Vec<String> {
        matching
            .iter()
            .filter(|rule| rule["effect"] == effect)
            .map(|rule| rule["ruleId"].as_str().expect("ruleId").to_string())
            .collect()
    };
    for (effect, decision) in [("FORBID", "BLOCK"), ("REQUIRE_APPROVAL", "NEEDS_APPROVAL"), ("PERMIT", "ALLOW")] {
        let matched = ids(effect);
        if !matched.is_empty() {
            return (decision, matched);
        }
    }
    ("BLOCK", Vec::new())
}
