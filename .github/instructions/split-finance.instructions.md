---
description: "Rules for fee, split, recipient allocation, provider split execution and reconciliation."
applyTo: 'packages/split/**/*.ts,packages/pricing/**/*.ts,packages/domain/**/*split*.ts,apps/payment-api/**/*split*.ts,apps/platform-api/**/*split*.ts,supabase/migrations/**/*split*.sql,supabase/tests/**/*split*.sql'
---

# Swiftpayments Split / Financial Instructions

Read `AGENTS.md`, `docs/SPLIT_ENGINE.md` and `docs/FEES_LEDGER_RECONCILIATION.md` before editing.

Rules:
- money integer minor, rates integer bps;
- `splittable = gross - platform_fee`;
- provider cost never silently reduces recipient entitlement;
- one rule version uses percentage OR fixed mode;
- percentage total exactly 10000 bps;
- deterministic remainder recipient;
- final allocations must conserve splittable amount exactly;
- freeze PaymentSplitSnapshot before provider request leaves process;
- rule edits create new version; never mutate historical economics;
- provider-native split requires declared capability + active recipient mapping + shared conformance GREEN;
- provider incompatibility blocks before send; never strip split;
- ambiguous create blocks fallback and triggers reconciliation;
- internal-ledger split remains disabled until settlement/custody ADR accepted;
- every behavior change needs `SPLIT-*` RED test first.
