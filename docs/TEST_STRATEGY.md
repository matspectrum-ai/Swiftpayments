# Test Strategy — RED First

## 1. Rule

No behavior implementation before its fail-first test/contract evidence exists.

## 2. Layers

### Domain/unit — Vitest
Pure state transitions, fee arithmetic, routing eligibility, fingerprints, mappers, redaction.

### API/application — Vitest + `fastify.inject`
Authentication, authorization, validation, idempotency, error semantics, application orchestration.

### Database/RLS — pgTAP + integration SQL
Constraints, uniqueness, tenant isolation, transaction atomicity, concurrent idempotency and state-update protection.

### Provider contract — shared Vitest suite
One suite executed against simulator/FlevoPay/AkkadPag adapters.

### E2E — Playwright
Merchant onboarding/KYC, admin approval, product/link checkout, buyer Pix state, developer key flows.

### Performance — k6
Create/read hot paths, webhook bursts, dashboard reads and DB index budgets.

## 3. RED evidence

A valid RED phase demonstrates the test fails because required behavior is absent/wrong. A test failing due to broken setup is not RED evidence.

## 4. Minimum acceptance matrix

### Merchant/KYC
- `KYC-001` incomplete submission rejected;
- `KYC-002` submitted merchant cannot create live payment;
- `KYC-003` authorized admin approval enables eligibility;
- `KYC-004` merchant cannot self-approve;
- `KYC-005` rejection/needs-info reason stored/audited;
- `KYC-006` suspension blocks existing live key.

### Payments
- `PAY-001` create valid Pix;
- `PAY-002` same idempotency key/payload returns same semantic resource;
- `PAY-003` same key/different payload conflicts;
- `PAY-004` payment public payload hides provider;
- `PAY-005` terminal state cannot regress;
- `PAY-006` duplicate webhook no-op;
- `PAY-007` ambiguous provider timeout stops failover.

### Providers
- `PROV-001` Flevo conforms;
- `PROV-002` Akkad conforms once mapping exists;
- `PROV-003` invalid webhook auth cannot mutate Payment;
- `PROV-004` unknown provider status cannot become paid;
- `PROV-005` provider client contains no canonical business mapping (architecture lint/test where practical).

### Routing
- primary/fallback eligibility, disabled provider, external merchant readiness, historical binding.

### Fees
- global rule;
- merchant override precedence;
- fixed + percentage integer arithmetic;
- deterministic rounding;
- historical snapshot immutable;
- provider cost hidden from merchant.

### Security
- cross-tenant reads/writes denied;
- admin routes denied to merchant;
- revoked API key denied immediately;
- KYC file public access denied;
- webhook SSRF validation;
- secrets redacted from logs.

## 5. Concurrency

Explicit concurrent tests are mandatory for:
- first-use idempotency key race;
- duplicate provider webhook race;
- payment terminal transition race;
- dashboard refresh lease;
- ledger unique source effects if ledger enabled.

## 6. Fixtures

Provider fixtures should be sanitized real payloads where possible, versioned and labeled by source/version/date. Do not edit fixtures to hide a provider contract change; add/update fixtures and document mapping delta.

## 7. Coverage philosophy

Coverage percentage is secondary. Critical invariants require explicit tests even if line coverage already includes code.
