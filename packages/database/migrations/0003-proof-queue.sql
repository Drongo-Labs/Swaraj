-- 0003 — proof pipeline: durable job queue with lease semantics and the
-- artifact ledger filled in as proofs and zkVerify attestations land.

CREATE TABLE proof_jobs (
    job_id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    receipt_id   text NOT NULL REFERENCES receipts (receipt_id),
    payload      jsonb NOT NULL,
    phase        text NOT NULL DEFAULT 'QUEUED'
                     CHECK (phase IN ('QUEUED', 'LEASED', 'DONE', 'FAILED')),
    attempts     integer NOT NULL DEFAULT 0,
    max_attempts integer NOT NULL DEFAULT 3,
    last_error   text,
    leased_at    timestamptz,
    enqueued_at  timestamptz NOT NULL DEFAULT now(),
    finished_at  timestamptz
);

CREATE INDEX proof_jobs_backlog ON proof_jobs (job_id) WHERE phase = 'QUEUED';

CREATE TABLE proof_artifacts (
    artifact_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id      bigint NOT NULL REFERENCES proof_jobs (job_id) ON DELETE CASCADE,
    receipt_id  text NOT NULL,
    kind        text NOT NULL CHECK (kind IN ('VERIFICATION_BUNDLE', 'ZKVERIFY_ATTESTATION')),
    content     jsonb NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO applied_migrations (ordinal, label) VALUES (3, 'proof-queue')
    ON CONFLICT (ordinal) DO NOTHING;
