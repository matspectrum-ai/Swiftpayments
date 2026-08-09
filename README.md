# Swiftpayments

Swiftpayments is a Pix-only, multi-provider payment platform built as an AI-native, document-driven engineering system.

The repository is intentionally governed before implementation. Human engineers and AI agents must treat the normative documents as executable constraints, not suggestions.

## Product surfaces

- `app.swiftpay.com` — merchant dashboard.
- `admin.swiftpay.com` — internal Swiftpay operations/compliance console.
- `api.swiftpay.com` — public Pix payments API.
- `pay.swiftpay.com` — hosted checkout and payment links.

## Target stack

- Next.js + React + TypeScript for web surfaces.
- Node.js + TypeScript + Fastify for APIs.
- Supabase/PostgreSQL for canonical data, Auth, RLS, Storage, Realtime, Queues (`pgmq`) and Cron (`pg_cron`).
- OpenAPI 3.1 for public API contracts.
- Vitest, Fastify inject, pgTAP, Playwright and k6 for verification.

No RabbitMQ, Kafka, Kubernetes, Redis or separate workflow engine is required for the initial architecture. Add infrastructure only through an accepted ADR backed by measured need.

## Architecture

The proven two-backend boundary is preserved and adapted to this stack:

- `platform-api`: identity/session integration, merchant onboarding, KYC, admin, catalog, checkout configuration, settings, dashboards and internal operations.
- `payment-api`: public payments API, payment domain, idempotency, routing, providers, provider webhooks and merchant webhooks.
- shared packages contain contracts/domain primitives but never provider-specific behavior in canonical domain objects.

## Non-negotiable scope

**Pix is the only payment method.** Card and boleto code, contracts, tables, UI, flags and provider capabilities must not be introduced without a new approved product RFC.

## Repository governance

Start here:

1. [`AGENTS.md`](./AGENTS.md)
2. [`docs/INDEX.md`](./docs/INDEX.md)
3. [`.ai/ENGINEERING_HARNESS.md`](./.ai/ENGINEERING_HARNESS.md)
4. [`docs/DECISIONS.md`](./docs/DECISIONS.md)
5. [`docs/OPEN_QUESTIONS.md`](./docs/OPEN_QUESTIONS.md)

Every change follows: **Problem Analysis → Specification → Contract → RED → GREEN → Refactor → Acceptance → Commit**.

No feature implementation is valid when the specification, contract and fail-first tests do not exist first.
