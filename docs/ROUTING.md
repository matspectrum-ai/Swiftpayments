# Pix Routing Specification

## 1. Goal
Select an eligible provider without changing merchant-facing semantics, dropping split requirements or creating duplicate Pix charges.

## 2. Eligibility

Provider connection is eligible only when:
- provider/connection enabled for environment;
- Pix capability/config/credentials ready;
- health/circuit allows create;
- merchant/provider policy allows it;
- required ProviderMerchantAccount active;
- admin routing config allows it;
- **if Payment has split:** provider execution strategy can represent the frozen SplitSnapshot exactly and required canonical-recipient→provider mappings are active.

## 3. Strategy
P0: configured primary + deterministic eligible fallback. No merchant-visible provider selection. Advanced weighted/A-B/cost/success policy may later use same interface.

## 4. RoutingDecision
Immutable candidate set, ineligibility reasons, selected provider, strategy/version, health/readiness/split-compatibility snapshot, correlation/time.

## 5. Failure classes
Definitive pre-send/provider rejection may allow controlled fallback. Ambiguous outcome means:

`ambiguous → stop routing → payment/split reconciliation_required`.

Never create a second charge blindly.

## 6. Split-specific routing law

- Split requirement is part of Payment intent, not an optional provider feature.
- Provider without required split capability is ineligible.
- Fallback reevaluates all split capability/mapping constraints.
- Fallback must preserve the same immutable SplitSnapshot.
- No fallback path may replace split with unsplit payment.
- If no eligible provider exists, return canonical `split_provider_unavailable` before external create.
- For an existing Payment, follow-up operations remain bound to the provider/attempt that actually created it.

## 7. Provider disable/historical binding
Disable excludes new routing immediately; existing Payment follows historical provider evidence.

## 8. Tests
`ROUTE-001` primary eligible; `002` disabled excluded; `003` definitive failure can safe-fallback; `004` ambiguous never fallback; `005` required external merchant inactive excludes; `006` follow-up uses original provider; `007` provider hidden publicly; `008` split Payment excludes non-split provider; `009` fallback preserves identical SplitSnapshot; `010` no compatible provider fails before send.
