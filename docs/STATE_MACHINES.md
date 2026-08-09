# Authoritative State Machines

Transitions outside this document are invalid until docs/contracts/tests change.

## Merchant
`draft → onboarding → pending_review → active → suspended`; `pending_review → rejected`; rejected may return to onboarding; authorized reinstatement may `suspended → active`.

## KYC
`not_started → in_progress → submitted → under_review → approved | rejected | needs_information`; needs-info returns to in-progress/submitted. Prior decisions are never overwritten.

## Payment

Public:
`created → pending → paid | expired | failed`.

Internal operational state may include `reconciliation_required` for ambiguous provider outcome. Terminal public state never regresses.

## ProviderAttempt
`created → sent → succeeded | definitive_failed | ambiguous`.

`ambiguous` forbids blind fallback.

## SplitRule

```text
draft → active → superseded
action: disable active → disabled
```

A version referenced by PaymentSplitSnapshot is immutable even after superseded/disabled.

## PaymentSplitSnapshot

```text
planned → frozen → execution_pending
execution_pending → executed
execution_pending → failed
execution_pending → reconciliation_required
```

Rules:
- `planned → frozen` occurs before provider create transmission;
- allocations cannot change after `frozen`;
- provider create ambiguity can move split execution to `reconciliation_required`;
- `executed` means execution evidence matches the canonical allocation semantics, not merely that HTTP returned 2xx.

## SplitExecution

Native provider:
`created → submitted → confirmed | failed | ambiguous`.

Internal ledger, when enabled:
`created → posting → posted | failed | reconciliation_required`.

## PaymentLink
`draft → active → disabled`; optional lifetime `active → expired`. Child Payment does not terminate unlimited link.

## Order
`pending_payment → paid | payment_failed | expired | cancelled`.

## ProviderMerchantAccount
`not_required` or `pending → under_review → active | rejected`; `active ↔ suspended` via authorized actions.

## WebhookDelivery
`pending → delivering → delivered | retry_scheduled`; retry returns to delivering; exhausted retry → `dead_letter`.

## Payout (settlement-dependent)
`requested → processing → completed | failed | rejected | cancelled` only after settlement/custody activation.
