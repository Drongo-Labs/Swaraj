//! Shared wire types for the gate: the JSON shapes produced by the
//! TypeScript policy compiler are deserialized here unchanged, so the
//! guest re-evaluates exactly the constraints the gateway compiled.

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "kind")]
pub enum IntTerm {
    #[serde(rename = "const")]
    Const { value: i64 },
    #[serde(rename = "field")]
    Field { name: String },
    #[serde(rename = "sum")]
    Sum { parts: Vec<IntTerm> },
    #[serde(rename = "diff")]
    Diff { left: Box<IntTerm>, right: Box<IntTerm> },
    #[serde(rename = "prod")]
    Prod { parts: Vec<IntTerm> },
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum CompareOp {
    #[serde(rename = "eq")]
    Eq,
    #[serde(rename = "ne")]
    Ne,
    #[serde(rename = "lt")]
    Lt,
    #[serde(rename = "le")]
    Le,
    #[serde(rename = "gt")]
    Gt,
    #[serde(rename = "ge")]
    Ge,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "kind")]
pub enum BoolTerm {
    #[serde(rename = "compare")]
    Compare { op: CompareOp, left: IntTerm, right: IntTerm },
    #[serde(rename = "all")]
    All { parts: Vec<BoolTerm> },
    #[serde(rename = "any")]
    Any { parts: Vec<BoolTerm> },
    #[serde(rename = "not")]
    Not { part: Box<BoolTerm> },
    #[serde(rename = "implies")]
    Implies { when: Box<BoolTerm>, then: Box<BoolTerm> },
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct NamedAssertion {
    #[serde(rename = "ruleId")]
    pub rule_id: String,
    pub assertion: BoolTerm,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct PolicyDoc {
    #[serde(rename = "policyId")]
    pub policy_id: String,
    pub revision: i64,
    pub fields: Vec<String>,
    pub assumptions: Vec<NamedAssertion>,
    pub rules: Vec<NamedAssertion>,
}

/// Ground action values; every entry is a canonical decimal string.
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Default)]
pub struct GroundBinding {
    pub values: BTreeMap<String, String>,
}
