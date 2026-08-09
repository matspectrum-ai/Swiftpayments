# Fees, Split Economics, Ledger and Reconciliation

## 1. Separate economic facts

Never conflate:
1. `gross_amount` — buyer pays;
2. `platform_fee` — Swiftpay charges merchant;
3. `provider_cost` — provider charges Swiftpay;
4. `split_allocation` — who is economically entitled to merchant-side distributable value;
5. `settlement_execution` — how money is actually moved/credited.

Canonical:

```text
merchant_economic_net = gross_amount - platform_fee
splittable_amount      = merchant_economic_net
platform_margin        = platform_fee - provider_cost
```

Provider cost does not silently reduce split entitlement.

## 2. Fee contexts
`pix_api`, `pix_checkout`, `pix_payment_link`.

Fee resolution: `MerchantFeeOverride → fallback PlatformFeeRule`. Provider cost has independent `ProviderCostRule` hierarchy. Fixed/percentage/fixed+percentage use integer minor/bps arithmetic.

## 3. Immutable snapshots
FeeSnapshot persists gross, rule/version, fixed/bps, platform fee, provider cost status/value, merchant net/margin and calculation version. Future fee changes never rewrite history.

PaymentSplitSnapshot is separate and persists exact recipient allocations from `splittable_amount` after fee calculation. Future split-rule changes never rewrite history.

## 4. Split reference
All split arithmetic, recipient eligibility, execution modes and reconciliation rules are normative in `SPLIT_ENGINE.md`.

## 5. Provider cost timing
If unknown at create, record unknown/estimated; reconciliation may finalize a separate provider-cost fact later. Do not fabricate.

## 6. Native provider split
Native provider execution is permitted without inventing Swiftpay custodial balance, provided provider contract proves the allocation behavior. Expected canonical allocation remains Swiftpay truth; provider evidence is reconciled against it.

## 7. Ledger architecture — feature gated
If settlement requires Swiftpay to hold/account/redistribute balances, use append-only balanced-entry semantics. Corrections = compensating entries; DB unique constraints enforce idempotency; no direct balance rewrites.

Potential dimensions: merchant/recipient pending/available/reserved/blocked; provider settlement/cost; platform fee/margin/payout.

Exact chart waits for custody ADR.

## 8. Internal split settlement
`internal_ledger` SplitExecution is forbidden until custody/settlement ADR accepted. Once enabled, each PaymentSplitAllocation must produce traceable balanced ledger evidence and be idempotent by allocation/source identity.

## 9. Payout/cashout
Activate only if settlement model requires Swiftpay-managed Pix-out. Test environment never produces real payout.

## 10. Reconciliation
Compare canonical Payment/FeeSnapshot/SplitSnapshot against provider/ledger evidence. Critical cases include ambiguous create, late paid, paid mismatch, duplicated fee/cost, split recipient mismatch, missing allocation, over/under allocation, provider rounding divergence and negative unsupported balance when ledger enabled.

## 11. Fail-fast
Critical financial write failure stops dependent downstream effects. Notifications/analytics may retry later.

## 12. Prohibited
- hidden fee/withholding;
- fake merchant-facing state;
- silently reducing recipient allocation with provider cost;
- silently dropping split;
- direct balance edits;
- float money arithmetic;
- historical recalculation with current rules.
