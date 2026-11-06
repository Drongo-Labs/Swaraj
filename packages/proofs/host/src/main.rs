//! Prover host: runs the guest and prints the committed statement.
//! Usage: swaraj-gate-host <elf> <input-json> [--prove] [--groth16] [--proof-out <path>]
//!    or: swaraj-gate-host <elf> --verify <proof>

use std::sync::Arc;

use sp1_sdk::blocking::{Elf, Prover, ProveRequest, ProverClient, SP1Stdin};
use sp1_sdk::{ProvingKey, SP1ProofWithPublicValues};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 3 {
        eprintln!("usage: {} <elf-path> <input-json> [--prove]", args[0]);
        std::process::exit(2);
    }
    let elf_path = &args[1];
    let prove = args.iter().any(|arg| arg == "--prove");
    // The default STARK is not zero knowledge; only the Groth16 wrap hides the witness.
    let groth16 = args.iter().any(|arg| arg == "--groth16");
    let proof_out = args
        .iter()
        .position(|arg| arg == "--proof-out")
        .and_then(|index| args.get(index + 1));

    let elf_bytes = std::fs::read(elf_path)?;
    let elf = Elf::Dynamic(Arc::from(elf_bytes.as_slice()));
    let prover = ProverClient::builder().cpu().build();

    if args[2] == "--verify" {
        let bytes = std::fs::read(&args[3])?;
        let (mut proof, _): (SP1ProofWithPublicValues, usize) =
            bincode::serde::decode_from_slice(&bytes, bincode::config::standard())?;
        let pk = prover.setup(elf)?;
        prover.verify(&proof, pk.verifying_key(), None)?;
        println!("verified");
        println!("{}", proof.public_values.read::<String>());
        return Ok(());
    }

    let input_json = std::fs::read_to_string(&args[2])?;
    let mut stdin = SP1Stdin::new();
    stdin.write_vec(input_json.into_bytes());

    if prove {
        let pk = prover.setup(elf)?;
        let request = prover.prove(&pk, stdin);
        let mut proof = if groth16 { request.groth16().run()? } else { request.run()? };
        prover.verify(&proof, pk.verifying_key(), None)?;

        let statement_id = proof.public_values.read::<String>();
        println!("statement_id={statement_id}");

        let proof_path = proof_out.cloned().unwrap_or_else(|| format!("{statement_id}.bin"));
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
