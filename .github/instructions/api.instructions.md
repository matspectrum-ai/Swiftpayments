---
applyTo: 'apps/*api/**,packages/contracts/**'
---
# API Rules

- Fastify + TypeScript strict.
- Validate every external request/response boundary with runtime schemas.
- Public contract is OpenAPI 3.1.
- Public create path is resource-oriented (`/v1/payments`), Pix-only.
- `Idempotency-Key` mandatory for create.
- Machine auth uses `sk_test_`/`sk_live_` key verifier, not human Supabase session.
- Admin/merchant human routes resolve Supabase identity plus server-side authorization.
- Thin routes: validate → authorize → application service → mapper → response.
- Never build response DTOs from raw provider objects.
- Cursor pagination on hot public collections.
- Canonical error codes; raw provider errors are internal.
- Correlation/request ID returned and propagated.
