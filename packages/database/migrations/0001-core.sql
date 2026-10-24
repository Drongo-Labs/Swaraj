-- 0001 — core configuration and decision tables.
-- Self-registers in applied_migrations so both first-boot initdb and the
-- app-level migrate runner converge on the same state.

CREATE TABLE IF NOT EXISTS applied_migrations (
    ordinal    integer PRIMARY KEY,
    label      text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications (
    app_id       text PRIMARY KEY,
    display_name text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE policy_revisions (
    policy_id     text NOT NULL,
    revision      integer NOT NULL CHECK (revision > 0),
    rule_set      jsonb NOT NULL,
    digest        text NOT NULL,
    is_live       boolean NOT NULL DEFAULT false,
    activated_at  timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (policy_id, revision)
);

-- At most one live revision per policy.
CREATE UNIQUE INDEX policy_revisions_single_live
    ON policy_revisions (policy_id) WHERE is_live;

CREATE TABLE authz_decisions (
    decision_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    app_id         text NOT NULL REFERENCES applications (app_id),
    intent_digest  text NOT NULL,
    policy_id      text NOT NULL,
    policy_revision integer NOT NULL,
    outcome        text NOT NULL CHECK (outcome IN ('ALLOW', 'BLOCK')),
    violated_rules jsonb NOT NULL DEFAULT '[]',
    smt_script     text NOT NULL,
    decided_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (app_id, intent_digest)
);

INSERT INTO applied_migrations (ordinal, label) VALUES (1, 'core')
    ON CONFLICT (ordinal) DO NOTHING;
