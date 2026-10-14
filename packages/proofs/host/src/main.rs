//! Prover host: feeds a gate input JSON and the guest ELF to the local
//! SP1 prover, executes (or proves) the guest, and prints the committed
//! statement id so the caller can bind it to the receipt.
//!
//! Usage:
//!   swaraj-gate-host <elf-path> <input-json> [--prove]

use sp1_sdk::{ProverClient, SP1Stdin};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 3 {
        eprintln!("usage: {} <elf-path> <input-json> [--prove]", args[0]);
        std::process::exit(2);
    }
    let elf_path = &args[1];
    let input_path = &args[2];
    let prove = args.iter().any(|arg| arg == "--prove");

    let elf = std::fs::read(elf_path)?;
    let input_json = std::fs::read_to_string(input_path)?;

    let client = ProverClient::new();
    let mut stdin = SP1Stdin::new();
    stdin.write_vec(input_json.into_bytes());

    let (public_values, report) = if prove {
        let (pk, vk) = client.setup(&elf);
        let proof = client.prove(&pk, &stdin).run()?;
        client.verify(&pk, &proof)?;
        (proof.public_values, Some(proof.proof))
    } else {
        let (mut executor, _) = client.execute(&elf, &stdin);
        let exec = executor.run()?;
        (exec.public_values, None)
    };

    let statement_id: String = public_values.read()?;
    println!("statement_id={statement_id}");

    if let Some(proof) = report {
        let proof_path = format!("{statement_id}.bin");
        std::fs::write(&proof_path, bincode_encode(&proof))?;
        println!("proof={proof_path}");
    }
    Ok(())
}

fn bincode_encode(proof: &sp1_sdk::SP1ProofWithPk) -> Vec<u8> {
    bincode::serde::encode_to_vec(proof, bincode::config::standard())
        .expect("proof serializes")
}
