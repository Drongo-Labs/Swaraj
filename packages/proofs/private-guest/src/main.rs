//! SP1 guest for Private Mandates. The mandate stays private: the guest
//! evaluates it over the action and commits only a salted commitment to the
//! mandate, the action's hash and the ALLOW outcome. If the mandate does not
//! allow the action the guest aborts, so no proof can exist for it.
//!
//! The evaluation mirrors `evaluateParsedMandate` in @swaraj/rules; the
//! vectors in packages/proofs/test/private-vectors hold the two together.

#![no_main]

use serde_json::Value;
use sha2::{Digest, Sha256};

sp1_zkvm::entrypoint!(main);

fn sha256_hex(parts: &[&[u8]]) -> String {
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

fn mandate_allows(mandate: &Value, action: &Value) -> bool {
    let timestamp = action["timestamp"].as_u64().expect("action timestamp");
    let from = mandate["validFrom"].as_u64().expect("validFrom");
    let until = mandate["validUntil"].as_u64().expect("validUntil");
    if timestamp < from || timestamp >= until {
        return false;
    }
    if mandate["agent"] != "*" && mandate["agent"] != action["agent"] {
        return false;
    }
    let rules = mandate["rules"].as_array().expect("mandate rules");
    let matching: Vec<&Value> = rules.iter().filter(|rule| rule_matches(action, rule)).collect();
    let any = |effect: &str| matching.iter().any(|rule| rule["effect"] == effect);
    !any("FORBID") && !any("REQUIRE_APPROVAL") && any("PERMIT")
}

fn main() {
    let raw = sp1_zkvm::io::read_vec();
    let input: Value = serde_json::from_slice(&raw).expect("input parses");
    let mandate_json = input["mandateJson"].as_str().expect("mandateJson");
    let action_json = input["actionJson"].as_str().expect("actionJson");
    let salt = input["salt"].as_str().expect("salt");
    let mandate: Value = serde_json::from_str(mandate_json).expect("mandate parses");
    let action: Value = serde_json::from_str(action_json).expect("action parses");

    assert!(mandate_allows(&mandate, &action), "the mandate does not allow this action");

    let commitment = sha256_hex(&[salt.as_bytes(), b":", mandate_json.as_bytes()]);
    let action_hash = sha256_hex(&[action_json.as_bytes()]);
    let statement = format!(
        "swaraj/statement/private-mandate/v1\nmandate_commitment={commitment}\naction={action_hash}\ndecision=ALLOW"
    );
    sp1_zkvm::io::commit(&statement);
}
