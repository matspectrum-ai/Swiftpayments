# Traceability Standard

Every production behavior traces requirement → contract → RED test → implementation → operational evidence.

## ID namespaces

| Prefix | Domain |
|---|---|
| `AUTH` | identity/session/API credentials |
| `MER` | merchant lifecycle |
| `KYC` | KYC/KYB/compliance |
| `ORD` | orders |
| `CHK` | checkout/payment links |
| `PAY` | canonical payments |
| `PROV` | provider contract/adapters |
| `ROUTE` | routing |
| `FEE` | pricing/provider cost |
| `SPLIT` | split rules/recipients/snapshots/execution |
| `LED` | ledger/settlement |
| `REC` | reconciliation |
| `WH` | webhooks/events |
| `SEC` | security/RBAC/RLS |
| `OBS` | observability/operations |

## Required chain
`Requirement ID → normative rule → schema/state/contract → RED test → implementation → telemetry/runbook when critical`.

Example:

```text
SPLIT-011
Requirement: provider fallback cannot alter split economics.
Contract: PaymentSplitSnapshot is frozen before provider send.
Test: routing.split-fallback-preserves-snapshot.test.ts.
Implementation: router consumes immutable snapshot ID.
Telemetry: split_provider_ineligible_total / split_reconciliation_required_total.
Runbook: split execution mismatch / provider ambiguity.
```

A requirement without evidence is incomplete.
