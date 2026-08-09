# Traceability Standard

Every production behavior must be traceable from requirement to evidence.

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
| `LED` | ledger/settlement |
| `REC` | reconciliation |
| `WH` | webhooks/events |
| `SEC` | security/RBAC/RLS |
| `OBS` | observability/operations |

## Required chain

`Requirement ID → normative rule → contract/schema/state transition → RED test → implementation → telemetry/runbook when operationally critical`.

## Example

```text
PAY-007
Requirement: ambiguous create timeout cannot produce blind failover.
Contract: ProviderCreateResult.kind = ambiguous.
Test: payment-create.ambiguous-timeout.test.ts.
Implementation: router stops and schedules reconciliation.
Telemetry: provider_create_ambiguous_total.
Runbook: reconcile ambiguous Pix create.
```

A requirement without test evidence is incomplete. A test without a named requirement should be treated as technical coverage, not acceptance evidence.
