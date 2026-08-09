# Repository Structure

Target monorepo after Foundation begins:

```text
Swiftpayments/
├── AGENTS.md
├── apps/
│   ├── merchant-web/      # Next.js
│   ├── admin-web/         # Next.js
│   ├── checkout-web/      # Next.js public buyer flow
│   ├── platform-api/      # Fastify platform/admin/KYC/catalog
│   └── payment-api/       # Fastify public payment/provider processing
├── packages/
│   ├── domain/
│   ├── contracts/
│   ├── db/
│   ├── providers/
│   ├── security/
│   ├── observability/
│   ├── config/
│   ├── ui/
│   └── testkit/
├── supabase/
│   ├── migrations/
│   ├── tests/
│   ├── seed.sql
│   └── config.toml
├── tests/
│   ├── integration/
│   ├── e2e/
│   ├── performance/
│   └── fixtures/providers/
├── docs/
├── .ai/
│   └── skills/
└── .github/
    ├── workflows/
    └── instructions/
```

## Dependency rules

- web apps consume contracts/UI, not provider adapters;
- platform-api does not implement provider parsing;
- payment-api orchestrates provider adapters through canonical port;
- domain package has no Fastify/Next/Supabase dependency;
- db package does not import UI/web code;
- provider packages may depend on canonical contracts/domain but never reverse;
- testkit may depend on contracts/domain and may expose simulators/builders.

## Endpoint organization

Use domain/action folders rather than giant route files. Suggested Fastify module layout:

```text
modules/payments/create/
  route.ts
  schema.ts
  service.ts
  mapper.ts
  create-payment.test.ts
```

Routes validate/authorize and delegate. Application service orchestrates. Mapper converts domain to response. Business rules belong in domain/application services, not route handlers.

## Provider organization

```text
packages/providers/src/
  contract/
  common/
  flevopay/
    client.ts
    schemas.ts
    parser.ts
    status-mapper.ts
    webhook-auth.ts
    adapter.ts
    fixtures/
  akkadpag/
    ...
```
