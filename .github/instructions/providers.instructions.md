---
applyTo: 'packages/providers/**,apps/payment-api/**/providers/**'
---
# Provider Integration Rules

Follow `docs/PROVIDER_CONTRACT.md` and `docs/ROUTING.md`.

Mandatory structure per provider:
- client.ts — HTTP only;
- schemas.ts — typed runtime external contracts;
- parser.ts — response/error/alias parsing;
- status-mapper.ts — external → canonical status;
- webhook-auth.ts — provider auth;
- adapter.ts — canonical PixProvider implementation;
- fixtures/ — sanitized examples.

Forbidden:
- business status mapping inside client;
- raw unknown payload as final canonical model when contract known;
- leaking provider/acquirer field to public API;
- assuming timeout = failure;
- generic retry middleware that retries create Pix without proven idempotency.

Every provider must run shared conformance tests.
