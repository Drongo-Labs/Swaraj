-- 0005 — per-agent budget spend ledger (PAYMENT / REFUND caps in the mandate).
-- Charged on ALLOW; released only when the receipt is INVALIDATED before settle.

CREATE TABLE budget_spends (
    receipt_id   text PRIMARY KEY,
    app_id       text NOT NULL REFERENCES applications (app_id),
    budget_id    text NOT NULL,
    amount       numeric(78,0) NOT NULL CHECK (amount > 0),
    released     boolean NOT NULL DEFAULT false,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX budget_spends_app_budget_created
    ON budget_spends (app_id, budget_id, created_at);

INSERT INTO applied_migrations (ordinal, label) VALUES (5, 'budget-spends')
    ON CONFLICT (ordinal) DO NOTHING;
