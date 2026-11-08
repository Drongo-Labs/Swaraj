export {
  openArtifactStore,
  storeProofArtifact,
  type ArtifactStore,
  type VerificationBundle,
} from "./artifacts.js";
export {
  buildStatement,
  canonicalStatementText,
  statementId,
  type GateStatement,
} from "./statement.js";
export {
  reevaluateGround,
  fromWirePolicy,
  toWirePolicy,
  EvaluationError,
  type GroundBinding,
  type GroundDecision,
} from "./verifier.js";
export {
  LocalProofSink,
  selectProofSink,
  type ProofSink,
  type SinkAttestation,
} from "./zkverify.js";
export {
  RemoteProofSink,
  type AttestationStatus,
  type RemoteSinkConfig,
  type SubmissionAccepted,
} from "./remote-sink.js";
export {
  NearProofSink,
  claimHashFromStatement,
  deployNearWasm,
  type NearGroth16Proof,
  type NearProofSinkConfig,
  type NearReceiptRecord,
} from "./near-sink.js";
export { runOneProofJob, type GateJobPayload, type WorkerOptions, type WorkerOutcome } from "./worker.js";
export {
  proveStatementViaSp1,
  Sp1ProverError,
  type Sp1GateInput,
  type Sp1ProofOutcome,
  type Sp1ProverConfig,
} from "./sp1-prover.js";
export * from "./mandate-statement.js";
export * from "./private-mandate.js";
