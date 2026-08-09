# Reference Architecture → Swiftpayments Mapping

Reference instructions contain production learnings from a broader platform. Swiftpayments preserves useful architecture/domain constraints while adapting to TypeScript/Supabase and Pix-only.

## Runtime mapping

| Reference | Swiftpayments |
|---|---|
| main API + payment API | `platform-api` + `payment-api` Fastify/TS |
| shared .NET core | shared TS domain/contracts/db/pricing/split/security packages |
| EF/PostgreSQL | PostgreSQL migrations + typed queries/repositories |
| MassTransit/RabbitMQ | Postgres outbox + pgmq |
| Hangfire | pg_cron + queues |
| SignalR | Supabase Realtime UX-only |
| S3 | Supabase Storage |
| human JWT | Supabase Auth |
| payment credential JWT | direct `sk_test_`/`sk_live_` keys |
| Swagger | OpenAPI 3.1 + Scalar |

## Preserved rules
- two backend boundaries;
- Order vs Payment;
- lazy PaymentLink Payment creation;
- invisible provider;
- Client→Parser→StatusMapper→Adapter;
- provider fixtures/conformance;
- admin-owned provider config;
- explicit test/live async scope;
- KYC/admin approval;
- provider submerchant capability;
- platform fee separated from provider cost;
- immutable fee snapshot;
- **split rule/recipient/domain separated from provider-native representation**;
- **provider-native split vs internal-ledger split execution separation**;
- deterministic integer split arithmetic and immutable PaymentSplitSnapshot;
- health/readiness, correlation, webhook audit, durable reprocessing;
- stable dependencies;
- append-only corrections when ledger enabled.

## Pix-only simplifications
- no card/boleto fields;
- no RabbitMQ/Redis/Kafka/Kubernetes initially;
- no duplicate log DB initially;
- no automatic create retry without proven idempotency;
- no merchant-facing provider selection;
- public split API uses preconfigured canonical rule instead of raw provider recipient contracts;
- referral/ranking/achievement optional;
- internal custody/payout only when required.

## Explicitly rejected
Any hidden withholding or merchant-facing financial state that differs from actual economics. Swiftpayments requires truthful fee/split snapshots and auditable accounting.
