//! Deterministic re-evaluation of a policy over a bound action. This is
//! the algorithm the SP1 guest proves: no solver, no I/O, integers only.

use crate::wire::{BoolTerm, CompareOp, GroundBinding, IntTerm, PolicyDoc};
use std::collections::BTreeMap;

#[derive(Clone, Debug, PartialEq)]
pub enum Outcome {
    Allow,
    Block,
}

impl Outcome {
    pub fn as_str(&self) -> &'static str {
        match self {
            Outcome::Allow => "ALLOW",
            Outcome::Block => "BLOCK",
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct Decision {
    pub outcome: Outcome,
    pub violated: Vec<String>,
}

#[derive(Clone, Debug, PartialEq)]
pub struct EvalError(pub String);

impl std::fmt::Display for EvalError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "gate evaluation error: {}", self.0)
    }
}

pub type EvalResult<T> = Result<T, EvalError>;

fn eval_int(term: &IntTerm, binding: &BTreeMap<String, i64>) -> EvalResult<i64> {
    match term {
        IntTerm::Const { value } => Ok(*value),
        IntTerm::Field { name } => binding
            .get(name)
            .copied()
            .ok_or_else(|| EvalError(format!("unbound field {name}"))),
        IntTerm::Sum { parts } => parts
            .iter()
            .try_fold(0i64, |acc, part| Ok(acc + eval_int(part, binding)?)),
        IntTerm::Prod { parts } => parts
            .iter()
            .try_fold(1i64, |acc, part| Ok(acc * eval_int(part, binding)?)),
        IntTerm::Diff { left, right } => {
            Ok(eval_int(left, binding)? - eval_int(right, binding)?)
        }
    }
}

fn eval_bool(term: &BoolTerm, binding: &BTreeMap<String, i64>) -> EvalResult<bool> {
    match term {
        BoolTerm::Compare { op, left, right } => {
            let l = eval_int(left, binding)?;
            let r = eval_int(right, binding)?;
            Ok(match op {
                CompareOp::Eq => l == r,
                CompareOp::Ne => l != r,
                CompareOp::Lt => l < r,
                CompareOp::Le => l <= r,
                CompareOp::Gt => l > r,
                CompareOp::Ge => l >= r,
            })
        }
        BoolTerm::All { parts } => {
            for part in parts {
                if !eval_bool(part, binding)? {
                    return Ok(false);
                }
            }
            Ok(true)
        }
        BoolTerm::Any { parts } => {
            for part in parts {
                if eval_bool(part, binding)? {
                    return Ok(true);
                }
            }
            Ok(false)
        }
        BoolTerm::Not { part } => Ok(!eval_bool(part, binding)?),
        BoolTerm::Implies { when, then } => {
            Ok(!eval_bool(when, binding)? || eval_bool(then, binding)?)
        }
    }
}

/// Parse the binding's decimal strings into integers and check the field
/// set against the policy. Unknown or missing fields are errors.
fn parse_binding(policy: &PolicyDoc, action: &GroundBinding) -> EvalResult<BTreeMap<String, i64>> {
    let declared: std::collections::BTreeSet<&str> =
        policy.fields.iter().map(String::as_str).collect();
    for name in action.values.keys() {
        if !declared.contains(name.as_str()) {
            return Err(EvalError(format!("unknown field {name}")));
        }
    }
    let mut binding = BTreeMap::new();
    for name in &policy.fields {
        let raw = action
            .values
            .get(name)
            .ok_or_else(|| EvalError(format!("missing value for {name}")))?;
        let parsed = raw
            .trim()
            .parse::<i64>()
            .map_err(|_| EvalError(format!("{name} is not an integer")))?;
        binding.insert(name.clone(), parsed);
    }
    Ok(binding)
}

/// Re-evaluate a committed policy over a committed action and produce the
/// same decision the gateway recorded.
pub fn decide(policy: &PolicyDoc, action: &GroundBinding) -> EvalResult<Decision> {
    let binding = parse_binding(policy, action)?;
    for assumption in &policy.assumptions {
        if !eval_bool(&assumption.assertion, &binding)? {
            return Err(EvalError(format!(
                "assumption {} does not hold",
                assumption.rule_id
            )));
        }
    }
    let mut violated = Vec::new();
    for rule in &policy.rules {
        if !eval_bool(&rule.assertion, &binding)? {
            violated.push(rule.rule_id.clone());
        }
    }
    let outcome = if violated.is_empty() {
        Outcome::Allow
    } else {
        Outcome::Block
    };
    Ok(Decision { outcome, violated })
}
