-- FND-007: enable the extensions the platform depends on.
-- pgmq: durable queue for the transactional outbox and async jobs.
-- pg_cron: scheduler for periodic reconciliation and cleanup jobs.

create extension if not exists pgmq with schema extensions;
create extension if not exists pg_cron with schema extensions;
