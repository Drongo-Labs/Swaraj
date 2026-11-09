//! Private Mandate guest: commits only a salted commitment, the action hash and ALLOW.
//! Aborts otherwise, so a blocked action has no proof. Parity: scripts/private-mandate.test.ts.

#![no_main]

mod mandate;

use serde_json::Value;

sp1_zkvm::entrypoint!(main);

fn main() {
    let raw = sp1_zkvm::io::read_vec();
    let input: Value = serde_json::from_slice(&raw).expect("input parses");
    let mandate_json = input["mandateJson"].as_str().expect("mandateJson");
    let action_json = input["actionJson"].as_str().expect("actionJson");
    let salt = input["salt"].as_str().expect("salt");
    let mandate: Value = serde_json::from_str(mandate_json).expect("mandate parses");
    let action: Value = serde_json::from_str(action_json).expect("action parses");

    assert!(mandate::decide(&mandate, &action).0 == "ALLOW", "the mandate does not allow this action");

    let commitment = mandate::sha256_hex(&[salt.as_bytes(), b":", mandate_json.as_bytes()]);
    let action_hash = mandate::sha256_hex(&[action_json.as_bytes()]);
    let statement = format!(
        "swaraj/statement/private-mandate/v1\nmandate_commitment={commitment}\naction={action_hash}\ndecision=ALLOW"
    );
    sp1_zkvm::io::commit(&statement);
}
