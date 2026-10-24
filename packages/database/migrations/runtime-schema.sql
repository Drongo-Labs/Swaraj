-- Runtime API schema. These tables are namespaced so the receipt/capability
-- pipeline can coexist with the generic policy/proof ledger from 0001-0004.

CREATE TABLE IF NOT EXISTS runtime_applications (
    id text PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runtime_policies (
    application_id text NOT NULL REFERENCES runtime_applications (id),
    id text NOT NULL,
    version integer NOT NULL CHECK (version > 0),
    action_type text NOT NULL,
    status text NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'RETIRED')),
    definition jsonb NOT NULL,
    policy_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (application_id, id, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS runtime_policies_one_active
    ON runtime_policies (application_id, id) WHERE status = 'ACTIVE';

CREATE TABLE IF NOT EXISTS runtime_actions (
    application_id text NOT NULL REFERENCES runtime_applications (id),
    id text NOT NULL,
    account_ref text NOT NULL,
    policy_id text NOT NULL,
    policy_version integer NOT NULL,
    idempotency_key text NOT NULL,
    intent_hash text NOT NULL,
    intent jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (application_id, id),
    UNIQUE (application_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS runtime_receipts (
    application_id text NOT NULL REFERENCES runtime_applications (id),
    id text NOT NULL,
    action_id text NOT NULL,
    status text NOT NULL CHECK (status IN ('PENDING', 'PROVED', 'NON_PROVABLE', 'INVALIDATED', 'DEV_UNVERIFIED')),
    claim_type text NOT NULL,
    reason_code text,
    intent_hash text NOT NULL,
    policy_hash text NOT NULL,
    evidence_root text NOT NULL,
    proof_reference text,
    signed_receipt jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (application_id, id),
    FOREIGN KEY (application_id, action_id) REFERENCES runtime_actions (application_id, id)
);

CREATE TABLE IF NOT EXISTS runtime_receipt_jobs (
    application_id text NOT NULL,
    receipt_id text NOT NULL,
    state text NOT NULL DEFAULT 'PENDING',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (application_id, receipt_id),
    FOREIGN KEY (application_id, receipt_id) REFERENCES runtime_receipts (application_id, id)
);

CREATE TABLE IF NOT EXISTS runtime_capabilities (
    id text PRIMARY KEY,
    application_id text NOT NULL REFERENCES runtime_applications (id),
    account_ref text NOT NULL,
    idempotency_key text NOT NULL,
    status text NOT NULL CHECK (status IN ('ISSUED', 'CONSUMED', 'EXPIRED', 'RELEASED')),
    token jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (application_id, account_ref, idempotency_key)
);

CREATE TABLE IF NOT EXISTS runtime_reservations (
    id text PRIMARY KEY,
    application_id text NOT NULL REFERENCES runtime_applications (id),
    capability_id text NOT NULL UNIQUE REFERENCES runtime_capabilities (id),
    account_ref text NOT NULL,
    amount numeric(78, 0) NOT NULL CHECK (amount >= 0),
    status text NOT NULL CHECK (status IN ('HELD', 'COMMITTED', 'RELEASED')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runtime_authorization_decisions (
    id uuid PRIMARY KEY,
    intent_hash text NOT NULL,
    policy_hash text NOT NULL,
    state_hash text NOT NULL,
    policy_version integer NOT NULL,
    decision text NOT NULL CHECK (decision IN ('ALLOW', 'BLOCK')),
    solver_status text NOT NULL,
    violated_rule_ids jsonb NOT NULL DEFAULT '[]',
    decision_hash text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runtime_proof_inputs (
    subject_kind text NOT NULL CHECK (subject_kind IN ('TRADE_RECEIPT', 'DECISION_RECEIPT')),
    application_id text NOT NULL,
    subject_id text NOT NULL,
    guest_bundle jsonb NOT NULL,
    bundle_sha256 text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (subject_kind, application_id, subject_id)
);

CREATE OR REPLACE FUNCTION guard_runtime_proof_inputs_append_only() RETURNS trigger AS $guard$
BEGIN
    RAISE EXCEPTION 'runtime_proof_inputs is append-only';
END;
$guard$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS runtime_proof_inputs_append_only ON runtime_proof_inputs;
CREATE TRIGGER runtime_proof_inputs_append_only
    BEFORE UPDATE OR DELETE ON runtime_proof_inputs
    FOR EACH ROW EXECUTE FUNCTION guard_runtime_proof_inputs_append_only();

CREATE TABLE IF NOT EXISTS runtime_decision_receipts (
    id uuid PRIMARY KEY,
    application_id text NOT NULL REFERENCES runtime_applications (id),
    decision_log_entry_hash text NOT NULL,
    intent_hash text NOT NULL,
    policy_hash text NOT NULL,
    state_hash text NOT NULL,
    decision text NOT NULL CHECK (decision = 'BLOCK'),
    violated_rule_ids jsonb NOT NULL,
    reference_time bigint NOT NULL,
    verifier_version text NOT NULL,
    solver_status text NOT NULL,
    status text NOT NULL CHECK (status IN ('PENDING', 'PROVED', 'NON_PROVABLE')),
    reason_code text,
    proof_metadata jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runtime_proof_jobs (
    id uuid PRIMARY KEY,
    application_id text NOT NULL,
    receipt_id text NOT NULL,
    state text NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    last_error text,
    zkverify_network text,
    zkverify_tx_hash text,
    zkverify_statement text,
    aggregation_id text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runtime_decision_proof_jobs (
    id uuid PRIMARY KEY,
    decision_receipt_id uuid NOT NULL REFERENCES runtime_decision_receipts (id),
    state text NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    last_error text,
    created_at timestamptz NOT NULL DEFAULT now()
);
