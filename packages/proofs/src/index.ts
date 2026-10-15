export {
  openArtifactStore,
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
export { runOneProofJob, type GateJobPayload, type WorkerOptions, type WorkerOutcome } from "./worker.js";
