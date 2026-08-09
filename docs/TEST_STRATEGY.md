# Test Strategy — RED First

## 1. Rule
No behavior implementation before fail-first evidence exists.

## 2. Layers
- Vitest domain/unit: states, fees, split arithmetic, routing, fingerprints, mappers/redaction.
- Vitest + `fastify.inject`: authz/validation/idempotency/orchestration.
- pgTAP + SQL integration: constraints/RLS/atomicity/concurrent idempotency/split sum/immutability.
- Provider shared suite: simulator/FlevoPay/AkkadPag, including split capability when claimed.
- Playwright: KYC/admin/product/link/buyer/API/split configuration flows.
- k6: create/read/webhook/dashboard DB budgets.

## 3. RED evidence
Failure must be because required behavior is absent/wrong, not broken test setup.

## 4. Acceptance IDs

### KYC
`KYC-001..006`: incomplete, live gate, authorized approval, no self-approval, reason/audit, suspension.

### Payments
`PAY-001..007`: valid Pix, idempotency same/conflict, provider-hidden payload, terminal non-regression, duplicate webhook, ambiguous timeout.

### Providers
`PROV-001` Flevo; `PROV-002` Akkad when mapped; invalid webhook auth; unknown status; architecture boundary.

### Routing
Primary/fallback, disabled provider, external merchant readiness, historical binding and split compatibility.

### Fees
Global/override, integer fixed+percentage, deterministic rounding, immutable snapshot, provider cost hidden.

### Split
- `SPLIT-001` bps total exactly 10000;
- `002` deterministic remainder;
- `003` exact allocation conservation;
- `004` provider cost not deducted from entitlement;
- `005` fixed over-allocation rejected;
- `006` inactive/cross-scope rule rejected;
- `007` recipient eligibility gate;
- `008` frozen snapshot immutable;
- `009` rule update does not alter history;
- `010` incompatible provider excluded;
- `011` fallback preserves snapshot;
- `012` provider recipient mapping gate;
- `013` ambiguous create stops fallback;
- `014` unsupported strategy fails before send;
- `015` idempotent retry no duplicate snapshot;
- `016` reconciliation discrepancy preserves snapshot;
- `017` provider IDs/cost not leaked.

### Security
Cross-tenant denial, admin denial, revoked key, private KYC, SSRF webhook validation, secret redaction, split recipient/rule tenant isolation.

## 5. Concurrency
Mandatory: idempotency first-use race, duplicate provider webhook, terminal transition, split snapshot freeze/create race, recipient/rule version update vs Payment snapshot, dashboard lease, ledger source uniqueness if enabled.

## 6. Fixtures
Sanitized real provider fixtures where possible, source/version/date labeled. Provider split fixtures are mandatory before claiming `supports_native_split`.

## 7. Coverage
Percent coverage is secondary. Critical invariants require named tests.
