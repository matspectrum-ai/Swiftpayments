# Reference Architecture → Swiftpayments Mapping

The supplied reference instructions contain production learnings from a broader SwiftPay-style platform. This repository preserves useful architecture/domain constraints while adapting them to the chosen TypeScript/Supabase stack and the Pix-only product requirement.

## Runtime mapping

| Reference pattern | Swiftpayments adaptation |
|---|---|
| main API + payment API | `platform-api` + `payment-api`, both Fastify/TypeScript |
| shared .NET core project | shared TypeScript packages (`domain`, `contracts`, `db`, `security`, `observability`, `testkit`) |
| Entity Framework/PostgreSQL | PostgreSQL-first migrations + typed repository/query layer |
| MassTransit/RabbitMQ | Postgres outbox + Supabase Queues/`pgmq` |
| Hangfire | `pg_cron` + queue messages |
| SignalR | Supabase Realtime for UX-only signals |
| S3 object storage | Supabase Storage |
| JWT human identity | Supabase Auth session/JWT |
| payment API credential flow | direct Swiftpay `sk_test_` / `sk_live_` API keys |
| Swagger | OpenAPI 3.1 + Scalar |

## Preserved architectural rules

- two backend boundaries with payment processing isolated from platform/admin flows;
- explicit `Order` vs `Payment` separation;
- lazy Payment creation for Payment Links;
- provider invisible to merchants;
- provider HTTP client/parser/status-mapper/adapter separation;
- provider fixtures and conformance tests;
- admin-owned provider configuration;
- explicit test/live environment propagation into workers/events;
- KYC + admin approval before live processing;
- provider-side submerchant account capability model when required;
- platform fee separated from provider cost;
- immutable fee snapshot;
- health/live and health/ready semantics;
- correlation IDs across all critical paths;
- dedicated provider-webhook audit logs;
- async dashboard/cache recomputation rather than heavy synchronous aggregation;
- durable reprocessing using the same canonical processing path;
- stable dependencies only;
- append-only financial correction model if ledger/custody is enabled.

## Deliberate simplifications

- only Pix exists as payment method;
- no card/boleto-specific fields or generalized method abstractions;
- no RabbitMQ/Redis/Kafka/Kubernetes in the initial stack;
- no duplicated log database initially; partition/retention can be added when measured volume justifies it;
- no automatic provider-create retry unless provider idempotency is proven by contract;
- no merchant-facing nominal/provider selection; routing remains an internal platform concern;
- referral/ranking/achievement modules are extension domains, disabled by default and not part of the initial delivery path;
- payout/custodial balance remains architecture-ready but activation is blocked by settlement/custody decision.

## Rejected rule

The reference material contains a hidden withholding mechanism that can present a different fee/payment state to merchants than the platform actually applies. This is explicitly rejected. Swiftpayments requires truthful merchant-facing financial state, deterministic fees and auditable accounting.
