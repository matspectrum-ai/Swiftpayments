# Pix Routing Specification

## 1. Goal

Select an eligible provider without changing merchant-facing API semantics and without creating duplicate valid Pix charges.

## 2. Eligibility

A provider connection is eligible when all required conditions hold:

- provider enabled;
- connection enabled for environment;
- Pix capability enabled;
- credentials/config valid enough for operation;
- provider circuit/health does not exclude new creates;
- merchant policy allows provider;
- required external ProviderMerchantAccount is active;
- admin routing config allows it.

## 3. P0 strategy

Start simple:

1. configured primary provider;
2. deterministic secondary/fallback order;
3. no ML routing;
4. no merchant-visible provider selection.

Weighted/A-B/cost/success strategies may be added later behind same `RoutingPolicy` interface and tests.

## 4. Selection record

Every create records immutable `RoutingDecision` containing:

- candidate set;
- ineligibility reasons;
- selected provider;
- strategy/version;
- health/readiness snapshot relevant to decision;
- correlation id/time.

## 5. Failure classes

### Definitive pre-send or definitive provider rejection
Fallback may be allowed if business/provider rules classify it safe.

### Ambiguous outcome
Examples: request body transmitted and connection resets; timeout after provider may have persisted charge.

Rule:

```text
ambiguous → stop routing → reconciliation_required
```

Never create second provider charge blindly.

## 6. Provider disable

Disabling provider immediately removes it from new routing. Existing payments remain bound to the provider that created them for query/webhook/reconciliation.

## 7. Historical binding

`ProviderAttempt`/routing data attached to an existing Payment always drives follow-up provider operations. Never resolve an old payment using the currently active provider.

## 8. Future ranking

If provider scoring is introduced, use bounded sample windows and deterministic tie-breaks. Metrics are operational signals, not permission to violate ambiguity/idempotency rules.

## 9. Tests

- `ROUTE-001` primary selected when eligible;
- `ROUTE-002` disabled primary excluded;
- `ROUTE-003` definite unavailable primary can fallback;
- `ROUTE-004` ambiguous primary never falls back;
- `ROUTE-005` external merchant not active excludes provider when required;
- `ROUTE-006` existing payment follow-up uses original provider;
- `ROUTE-007` selected provider never appears in public Payment payload.
