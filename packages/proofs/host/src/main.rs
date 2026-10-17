//! Prover host: feeds a gate input JSON and the guest ELF to the local
//! SP1 prover, executes (or proves) the guest, and prints the committed
//! statement id so the caller can bind it to the receipt.
//!
//! Usage:
//!   swaraj-gate-host <elf-path> <input-json> [--prove]

use std::sync::Arc;

use sp1_sdk::blocking::{Elf, Prover, ProveRequest, ProverClient, SP1Stdin};
use sp1_sdk::ProvingKey;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 3 {
        eprintln!("usage: {} <elf-path> <input-json> [--prove]", args[0]);
        std::process::exit(2);
    }
    let elf_path = &args[1];
    let input_path = &args[2];
    let prove = args.iter().any(|arg| arg == "--prove");

    let elf_bytes = std::fs::read(elf_path)?;
    let elf = Elf::Dynamic(Arc::from(elf_bytes.as_slice()));
    let input_json = std::fs::read_to_string(input_path)?;

    let prover = ProverClient::builder().cpu().build();
    let mut stdin = SP1Stdin::new();
    stdin.write_vec(input_json.into_bytes());

    if prove {
        let pk = prover.setup(elf)?;
        let mut proof = prover.prove(&pk, stdin).run()?;
        prover.verify(&proof, pk.verifying_key(), None)?;

        let statement_id = proof.public_values.read::<String>();
        println!("statement_id={statement_id}");

        let proof_path = format!("{statement_id}.bin");
        let bytes = bincode::serde::encode_to_vec(&proof, bincode::config::standard())?;
        std::fs::write(&proof_path, bytes)?;
        println!("proof={proof_path}");
    } else {
        let (mut public_values, _report) = prover.execute(elf, stdin).run()?;
        let statement_id = public_values.read::<String>();
        println!("statement_id={statement_id}");
    }
    Ok(())
}
