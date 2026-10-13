-- 0001-init.sql
-- Executed automatically on the first boot of a fresh db_data volume.
--
-- Day 1 scaffold only. The real schema (applications, policy versions,
-- decisions, receipts, proof jobs, reservations, idempotency keys) is
-- defined by the packages/database rewrite in Day 2 of RESTRUCTURE_PLAN.md
-- and will replace this file.

-- Nothing to create yet. Sanity check that the init hook runs at all.
DO $$ BEGIN
  RAISE NOTICE 'swaraj init: schema placeholder executed, database %', current_database();
END $$;
