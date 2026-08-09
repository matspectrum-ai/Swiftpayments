# Fees, Ledger and Reconciliation

## 1. Separation of concepts

Three economic concepts must never be conflated:

1. **gross amount** — what buyer pays;
2. **platform fee** — what Swiftpay charges merchant;
3. **provider cost** — what provider charges Swiftpay.

Derived:

```text
merchant_economic_net = gross - platform_fee
platform_economic_margin = platform_fee - provider_cost
```

These values do not by themselves prove custody or withdrawable balance.

## 2. Fee contexts

Because the reference platform priced by acquisition surface, preserve three Pix contexts:

- `pix_api`;
- `pix_checkout`;
- `pix_payment_link`.

## 3. Platform pricing hierarchy

```text
MerchantFeeOverride (if active/applicable)
        ↓ fallback
PlatformFeeRule
```

Merchant cannot set its own financial fee rules through merchant UI/API.

Modes:
- fixed only;
- percentage only;
- fixed + percentage.

Amounts integer minor; percentage integer bps; rounding rule deterministic and tested.

## 4. Provider cost hierarchy

Provider cost is separate:

```text
MerchantProviderCostOverride (optional)
        ↓ fallback
ProviderCostRule
```

Provider cost is internal/admin-only.

## 5. Fee snapshot

At the defined pricing moment, persist immutable:
- gross;
- applied platform fixed/bps;
- platform fee;
- provider cost known/estimated status;
- merchant economic net;
- margin;
- rule IDs/versions;
- calculation version.

Changing future rules never rewrites past snapshot.

## 6. Provider cost timing

If provider cost is not knowable at create time, snapshot records `provider_cost_status=unknown|estimated` and reconciliation may finalize a separate cost fact later. Never fabricate exact cost.

## 7. Ledger architecture (feature-gated)

If settlement model requires Swiftpay to account for balances/payouts, use append-only double-entry-style or balanced-entry ledger semantics.

Principles:
- entries immutable;
- every entry references source operation;
- correction is compensating entry;
- balances derived/materialized from entries with DB-enforced atomicity;
- unique constraints are final idempotency guard;
- no direct balance rewrite during reconciliation.

Potential account dimensions:
- merchant pending/available/reserved/blocked;
- provider settlement/cost;
- platform fee/margin/payout.

Exact chart of accounts waits for custody ADR.

## 8. Payout/cashout (architecture-ready Pix-out)

Only activate if settlement model requires Swiftpay-managed payout. Method remains Pix.

Payout service must bind to original/provider-specific balance bucket where financial model requires it; no current-provider substitution for historical funds.

Test environment must not produce real payout.

## 9. Reconciliation

Reconciliation compares expected domain/accounting impact vs provider/ledger evidence.

Use:
- immutable `ReconciliationRun`;
- per-resource/provider differences;
- severity;
- expected/actual/difference;
- safe auto-correct eligibility;
- operator resolution/audit.

Critical cases:
- ambiguous create;
- late paid event;
- provider says paid but canonical payment not paid;
- canonical paid without provider evidence;
- duplicated provider cost/fee effect;
- negative/unsupported balance if ledger enabled.

## 10. Fail-fast financial ordering

When a critical financial write fails, stop downstream dependent side effects. Notifications/analytics/referrals can retry later; financial truth cannot be partially applied.

## 11. Prohibited behavior

- hidden fee/withholding not reflected truthfully in merchant accounting;
- presentation of fake normal fee while internally keeping all payment proceeds;
- direct balance edits;
- float money arithmetic;
- recalculating historical fees using current settings.
