//! Verifies SP1 Groth16 proofs on NEAR with the `alt_bn128` host functions,
//! so no oracle or other chain is trusted. It follows SP1's own Solidity
//! verifier (`SP1VerifierGroth16.sol`): a 4-byte key selector, then the exit
//! code, key root and nonce, then the 256-byte Groth16 proof.
//!
//! Only programs pinned at deployment are accepted. To add one, redeploy.

mod vk;

use near_sdk::json_types::Base64VecU8;
use near_sdk::{env, near, require, PanicOnDefault};

const PROOF_LEN: usize = 4 + 32 * 3 + 256;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Verifier {
    /// SP1 program keys, as `0x`-prefixed hex from `vk.bytes32()`.
    programs: Vec<String>,
}

#[near]
impl Verifier {
    #[init]
    pub fn new(programs: Vec<String>) -> Self {
        for program in &programs {
            program_key(program);
        }
        Self { programs }
    }

    pub fn programs(&self) -> &Vec<String> {
        &self.programs
    }

    /// Returns the statement the proof commits to. Panics unless the proof is
    /// valid for a pinned program, so a caller can never read a false `true`.
    pub fn verify(&self, program: String, public_values: Base64VecU8, proof: Base64VecU8) -> String {
        require!(self.programs.contains(&program), "unknown program");
        verify_proof(program_key(&program), &public_values.0, &proof.0);
        statement(&public_values.0)
    }
}

fn program_key(program: &str) -> [u8; 32] {
    let bytes = program.strip_prefix("0x").and_then(|hex_key| hex::decode(hex_key).ok());
    bytes.and_then(|key| key.try_into().ok()).unwrap_or_else(|| env::panic_str("bad program key"))
}

/// SP1 commits a bincode `String`: an 8-byte length, then the text.
fn statement(public_values: &[u8]) -> String {
    let text = public_values.get(8..).unwrap_or_else(|| env::panic_str("bad public values"));
    String::from_utf8(text.to_vec()).unwrap_or_else(|_| env::panic_str("bad public values"))
}

fn word(bytes: &[u8], index: usize) -> [u8; 32] {
    bytes[4 + 32 * index..4 + 32 * (index + 1)].try_into().unwrap()
}

/// Big-endian to the little-endian layout NEAR's host functions read.
fn le(bytes: &[u8]) -> [u8; 32] {
    let mut out: [u8; 32] = bytes.try_into().unwrap();
    out.reverse();
    out
}

fn verify_proof(program: [u8; 32], public_values: &[u8], proof: &[u8]) {
    require!(proof.len() == PROOF_LEN, "bad proof length");
    require!(proof[..4] == vk::VERIFIER_SELECTOR, "wrong verifier version");
    let (exit_code, vk_root, nonce) = (word(proof, 0), word(proof, 1), word(proof, 2));
    require!(exit_code == [0; 32], "program did not exit cleanly");
    require!(vk_root == vk::VK_ROOT, "wrong key root");

    let mut values_hash = env::sha256_array(public_values);
    values_hash[0] &= 0x1f; // fits the 254-bit field, as SP1 does
    let inputs = [program, values_hash, exit_code, vk_root, nonce];

    // L = CONSTANT + sum(input_i * PUBLIC_i). A scalar outside the field makes the host panic.
    let mut terms = Vec::with_capacity(96 * 6);
    terms.extend_from_slice(&vk::CONSTANT);
    terms.extend_from_slice(&le(&[[0; 31].as_slice(), &[1]].concat()));
    for (point, input) in vk::PUBLIC.iter().zip(inputs) {
        terms.extend_from_slice(point);
        terms.extend_from_slice(&le(&input));
    }
    let combined = env::alt_bn128_g1_multiexp(&terms);

    // e(A, B) * e(C, -delta) * e(alpha, -beta) * e(L, -gamma) == 1
    let groth16 = &proof[100..];
    let mut pairs = Vec::with_capacity(192 * 4);
    pairs.extend_from_slice(&le(&groth16[0..32]));
    pairs.extend_from_slice(&le(&groth16[32..64]));
    // The proof stores each Fq2 imaginary part first; NEAR wants the real part first.
    for offset in [96, 64, 160, 128] {
        pairs.extend_from_slice(&le(&groth16[offset..offset + 32]));
    }
    pairs.extend_from_slice(&le(&groth16[192..224]));
    pairs.extend_from_slice(&le(&groth16[224..256]));
    pairs.extend_from_slice(&vk::DELTA_NEG);
    pairs.extend_from_slice(&vk::ALPHA);
    pairs.extend_from_slice(&vk::BETA_NEG);
    pairs.extend_from_slice(&combined);
    pairs.extend_from_slice(&vk::GAMMA_NEG);
    require!(env::alt_bn128_pairing_check(&pairs), "invalid proof");
}

#[cfg(test)]
mod tests {
    use super::*;

    const FIXTURE: &str = include_str!("../../../packages/proofs/fixtures/private-mandate-groth16.json");
    const ALLOW: &str = include_str!("../../../packages/proofs/fixtures/decision-allow-groth16.json");
    const BLOCK: &str = include_str!("../../../packages/proofs/fixtures/decision-block-groth16.json");

    fn load(text: &str) -> (String, Vec<u8>, Vec<u8>) {
        let json: serde_json::Value = serde_json::from_str(text).unwrap();
        let field = |name: &str| json[name].as_str().unwrap().to_string();
        (field("program"), hex::decode(field("public_values")).unwrap(), hex::decode(field("proof")).unwrap())
    }

    fn fixture() -> (String, Vec<u8>, Vec<u8>) {
        load(FIXTURE)
    }

    fn verify(program: &str, public_values: Vec<u8>, proof: Vec<u8>) -> String {
        let (pinned, _, _) = fixture();
        Verifier::new(vec![pinned]).verify(program.to_string(), public_values.into(), proof.into())
    }

    #[test]
    fn the_real_proof_verifies_and_returns_its_statement() {
        let (program, public_values, proof) = fixture();
        let statement = verify(&program, public_values, proof);
        assert!(statement.starts_with("swaraj/statement/private-mandate/v1\nmandate_commitment="));
        assert!(statement.ends_with("\ndecision=ALLOW"));
    }

    #[test]
    fn decision_proofs_verify_for_allow_and_block() {
        let (allow_program, allow_values, allow_proof) = load(ALLOW);
        let (block_program, block_values, block_proof) = load(BLOCK);
        assert_eq!(allow_program, block_program);
        let verifier = Verifier::new(vec![fixture().0, allow_program.clone()]);
        let allowed = verifier.verify(allow_program.clone(), allow_values.into(), allow_proof.into());
        let blocked = verifier.verify(block_program, block_values.into(), block_proof.into());
        assert!(allowed.starts_with("swaraj/statement/mandate/v1\n"));
        assert!(allowed.contains("\ndecision=ALLOW\nmatched=permit_pay"), "{allowed}");
        assert!(blocked.contains("\ndecision=BLOCK\nmatched=forbid_cap"), "{blocked}");
    }

    #[test]
    #[should_panic(expected = "invalid proof")]
    fn a_block_proof_cannot_pass_as_allow() {
        let (program, _, block_proof) = load(BLOCK);
        let (_, allow_values, _) = load(ALLOW);
        Verifier::new(vec![program.clone()]).verify(program, allow_values.into(), block_proof.into());
    }

    #[test]
    #[should_panic]
    fn a_changed_proof_is_rejected() {
        let (program, public_values, mut proof) = fixture();
        proof[150] ^= 1;
        verify(&program, public_values, proof);
    }

    #[test]
    #[should_panic(expected = "invalid proof")]
    fn changed_public_values_are_rejected() {
        let (program, mut public_values, proof) = fixture();
        let last = public_values.len() - 1;
        public_values[last] ^= 1;
        verify(&program, public_values, proof);
    }

    #[test]
    #[should_panic(expected = "invalid proof")]
    fn a_changed_nonce_is_rejected() {
        let (program, public_values, mut proof) = fixture();
        proof[99] ^= 1;
        verify(&program, public_values, proof);
    }

    #[test]
    #[should_panic(expected = "unknown program")]
    fn an_unpinned_program_is_rejected() {
        let (_, public_values, proof) = fixture();
        verify(&format!("0x{}", "00".repeat(32)), public_values, proof);
    }

    #[test]
    #[should_panic(expected = "invalid proof")]
    fn a_proof_for_another_program_is_rejected() {
        let (program, public_values, proof) = fixture();
        let other = format!("0x{}", "11".repeat(32));
        Verifier::new(vec![program, other.clone()]).verify(other, public_values.into(), proof.into());
    }

    #[test]
    #[should_panic(expected = "wrong verifier version")]
    fn another_verifier_version_is_rejected() {
        let (program, public_values, mut proof) = fixture();
        proof[0] ^= 1;
        verify(&program, public_values, proof);
    }

    #[test]
    #[should_panic(expected = "program did not exit cleanly")]
    fn a_failed_exit_code_is_rejected() {
        let (program, public_values, mut proof) = fixture();
        proof[35] = 1;
        verify(&program, public_values, proof);
    }

    #[test]
    #[should_panic(expected = "bad proof length")]
    fn a_short_proof_is_rejected() {
        let (program, public_values, proof) = fixture();
        verify(&program, public_values, proof[..300].to_vec());
    }
}
