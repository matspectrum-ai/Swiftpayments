# Split Engine — Normative Pix Allocation Contract

Status: **P0 / REQUIRED**. This document is normative for split behavior.

## 1. Purpose

Swiftpayments supports Pix payment split while remaining provider-agnostic. Split expresses economic allocation of the merchant-side distributable amount among approved canonical recipients. It is not a provider routing hint and it is not the Swiftpay fee.

## 2. Definitions

- `gross_amount_minor`: buyer payment amount.
- `platform_fee_minor`: Swiftpay fee charged to merchant.
- `provider_cost_minor`: Swiftpay internal provider cost.
- `splittable_amount_minor = gross_amount_minor - platform_fee_minor`.
- `SplitRecipient`: canonical beneficiary identity controlled by Swiftpay domain.
- `SplitRule`: reusable versioned policy.
- `PaymentSplitSnapshot`: immutable Payment-specific resolved allocation.
- `PaymentSplitAllocation`: one final recipient entitlement.
- `SplitExecution`: evidence of native-provider or internal-ledger execution.

Provider cost affects Swiftpay margin and **does not** reduce `splittable_amount_minor`.

## 3. Attachment points

A split rule may be selected by:
- direct API Payment through `split_rule_id`;
- Product/Checkout configuration;
- PaymentLink configuration.

Resolution happens only at Payment creation. Commerce configuration never substitutes for immutable PaymentSplitSnapshot.

## 4. Recipient model

Live recipient must:
- exist as canonical SplitRecipient;
- belong to/authorize the merchant relationship required by product policy;
- be `live_eligible=true` under compliance policy;
- have any provider-specific submerchant/recipient mapping required by the selected execution strategy.

Provider recipient IDs are internal mappings and never accepted as public canonical recipient IDs.

A suspended/rejected recipient cannot be used for new live snapshots. Historical snapshots remain immutable.

## 5. Rule versioning

SplitRule has `draft|active|superseded|disabled`. An economic edit creates a new version/effective rule; never mutate a version referenced by a Payment.

Rule belongs to one merchant + environment. Cross-tenant/cross-environment use is forbidden.

## 6. Arithmetic mode: percentage

- every recipient uses integer `percentage_bps`;
- sum must equal exactly `10000`;
- calculate each provisional allocation with integer floor:
  `floor(splittable_amount_minor * bps / 10000)`;
- `rounding_remainder = splittable - sum(provisional)`;
- add all remainder cents to the configured `remainder_recipient_id`;
- final sum must equal `splittable_amount_minor` exactly.

The designated remainder recipient is part of the rule version/snapshot. No random remainder allocation.

## 7. Arithmetic mode: fixed

- recipients except the designated remainder recipient have non-negative `fixed_amount_minor`;
- fixed total must be <= splittable amount;
- remainder recipient receives `splittable - fixed_total`;
- negative remainder invalidates create before provider call.

A rule version cannot mix percentage and fixed semantics. Mixed arithmetic requires a future explicit contract version.

## 8. Calculation order

Mandatory:

```text
1 validate Payment amount
2 resolve FeeRule
3 create immutable FeeSnapshot
4 compute splittable = gross - platform_fee
5 resolve active SplitRule version
6 validate recipient eligibility
7 calculate exact allocations
8 create PaymentSplitSnapshot + allocations
9 freeze snapshot
10 route only among providers capable of exact execution
11 transmit provider create
```

No provider request is sent before the snapshot is frozen.

## 9. Idempotency

Payment idempotency fingerprint includes split economic intent. Same key + same resolved economic input returns same semantic Payment; same key + changed rule/version/economic input conflicts.

A retried application command never creates a second SplitSnapshot for the same Payment.

## 10. Execution strategies

### `native_provider`
Provider adapter maps canonical recipients to active provider recipient/submerchant IDs and sends allocation according to verified provider contract.

Requirements:
- provider claims and passes split conformance;
- representation is exact enough for canonical cents/bps semantics;
- max recipient limits respected;
- missing mapping blocks before send;
- response/webhook execution evidence recorded separately.

### `internal_ledger`
Swiftpay posts recipient entitlements to internal ledger/settlement accounts. This strategy is architecture-ready but **blocked until settlement/custody ADR is accepted**.

### `unsupported`
If neither strategy is valid, fail before external create with `split_provider_unavailable`. Never create unsplit Pix as fallback.

## 11. Routing

Split capability is a hard eligibility condition. Primary/fallback must both support the exact frozen plan. Fallback uses the same snapshot. Ambiguous create stops all fallback and marks payment/split reconciliation required.

## 12. Provider fee semantics

Provider adapter must document whether provider charges its cost separately, deducts from Swiftpay/provider balance, or influences native split mechanics. Regardless, adapter may not silently alter canonical merchant recipient entitlement. If provider economics make exact execution impossible, it is ineligible for that split mode.

## 13. Webhooks and completion

Provider payment `paid` proves payment status, not automatically split correctness. Native split execution may become `confirmed` only with sufficient provider contract/evidence; otherwise reconciliation remains pending without falsifying Payment paid state.

Merchant webhook `payment.paid` remains canonical Payment event. Split-specific merchant/admin views/events may be added under explicit contract; provider-specific split events stay internal.

## 14. Reconciliation

For each allocation compare:
- canonical recipient;
- expected minor amount;
- execution strategy;
- provider/ledger evidence;
- actual minor where known;
- difference and reason.

Any non-zero unexplained difference is recorded. No direct mutation of historical snapshot to make reconciliation pass.

## 15. Security/audit

Creating/updating/disabling SplitRule, recipient eligibility, provider recipient mapping and manual reconciliation are privileged/audited operations. Merchant can manage only recipients/rules allowed by product/RBAC policy and never provider secrets/IDs.

## 16. Public contract

v0.x public Payment API accepts only optional `split_rule_id`; arbitrary inline recipient banking/provider IDs are forbidden. This keeps input small, auditable and provider-agnostic.

## 17. Required RED tests

- `SPLIT-001` percentage bps must total 10000;
- `SPLIT-002` percentage rounding remainder assigned deterministically;
- `SPLIT-003` allocation sum equals splittable exactly;
- `SPLIT-004` provider cost does not reduce recipient entitlement;
- `SPLIT-005` fixed total cannot exceed splittable;
- `SPLIT-006` inactive/cross-tenant/cross-environment rule rejected;
- `SPLIT-007` ineligible recipient blocks live create;
- `SPLIT-008` snapshot immutable after frozen;
- `SPLIT-009` historical snapshot unaffected by rule update;
- `SPLIT-010` non-split provider excluded;
- `SPLIT-011` fallback preserves same snapshot;
- `SPLIT-012` missing provider recipient mapping blocks before send;
- `SPLIT-013` ambiguous create prevents fallback and requires reconciliation;
- `SPLIT-014` no compatible execution strategy fails before provider call;
- `SPLIT-015` duplicate create/idempotency creates no second snapshot;
- `SPLIT-016` provider execution discrepancy never rewrites snapshot;
- `SPLIT-017` public payload does not leak provider recipient IDs/provider cost.

## 18. Definition of Done for Split Engine

Not done until: pure arithmetic contract GREEN; DB constraints/concurrency GREEN; RBAC/RLS GREEN; API contract/OpenAPI GREEN; provider capability/conformance GREEN for enabled strategy; audit/observability GREEN; reconciliation behavior GREEN; docs/traceability updated; coherent commit produced.
