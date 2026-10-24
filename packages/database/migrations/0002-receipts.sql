-- 0002 — receipts, their append-only event log, the idempotency ledger,
-- and a database-level guard so illegal lifecycle transitions are
-- rejected by Postgres itself, not only by application code.

CREATE TABLE receipts (
    receipt_id   text PRIMARY KEY,
    app_id       text NOT NULL REFERENCES applications (app_id),
    intent_digest text NOT NULL,
    decision_id  bigint NOT NULL REFERENCES authz_decisions (decision_id),
    claim        jsonb NOT NULL,
    state        text NOT NULL DEFAULT 'PENDING'
                     CHECK (state IN ('PENDING', 'PROVED', 'NON_PROVABLE', 'INVALIDATED')),
    proof_ref    text,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE receipt_events (
    receipt_id  text NOT NULL REFERENCES receipts (receipt_id) ON DELETE CASCADE,
    seq         bigint GENERATED ALWAYS AS IDENTITY,
    from_state  text NOT NULL,
    to_state    text NOT NULL,
    note        text,
    recorded_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (receipt_id, seq)
);

CREATE TABLE idempotency_claims (
    app_id        text NOT NULL REFERENCES applications (app_id),
    idem_key      text NOT NULL,
    intent_digest text NOT NULL,
    receipt_id    text NOT NULL REFERENCES receipts (receipt_id),
    PRIMARY KEY (app_id, idem_key)
);

-- Legal transitions: PENDING -> {PROVED, NON_PROVABLE, INVALIDATED},
-- PROVED -> {INVALIDATED}. Every other move (including no-op same-state
-- updates) is rejected with SQLSTATE P0004.
CREATE FUNCTION guard_receipt_transition() RETURNS trigger AS $guard$
DECLARE
    legal boolean;
BEGIN
    SELECT (OLD.state, NEW.state) IN (
        ('PENDING', 'PROVED'),
        ('PENDING', 'NON_PROVABLE'),
        ('PENDING', 'INVALIDATED'),
        ('PROVED', 'INVALIDATED')
    ) INTO legal;

    IF NOT legal THEN
        RAISE EXCEPTION 'illegal receipt transition % -> %', OLD.state, NEW.state
            USING ERRCODE = 'P0004';
    END IF;

    NEW.updated_at := now();
    RETURN NEW;
END;
$guard$ LANGUAGE plpgsql;

CREATE TRIGGER receipts_state_guard
    BEFORE UPDATE OF state ON receipts
    FOR EACH ROW EXECUTE FUNCTION guard_receipt_transition();

INSERT INTO applied_migrations (ordinal, label) VALUES (2, 'receipt-lifecycle')
    ON CONFLICT (ordinal) DO NOTHING;
