-- 0004 — SP1 proof artifacts: the guest's proof file joins the artifact
-- ledger next to verification bundles and sink attestations.

ALTER TABLE proof_artifacts DROP CONSTRAINT proof_artifacts_kind_check;

ALTER TABLE proof_artifacts ADD CONSTRAINT proof_artifacts_kind_check
    CHECK (kind IN ('VERIFICATION_BUNDLE', 'ZKVERIFY_ATTESTATION', 'SP1_PROOF'));

INSERT INTO applied_migrations (ordinal, label) VALUES (4, 'sp1-proof-kind')
    ON CONFLICT (ordinal) DO NOTHING;
