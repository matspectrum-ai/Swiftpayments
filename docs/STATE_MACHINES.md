# Authoritative State Machines

State transitions outside this document are invalid unless this document changes first.

## Merchant

```text
draft
  → onboarding
  → pending_review
  → active
  → suspended

pending_review → rejected
rejected → onboarding          (resubmission policy)
suspended → active             (authorized reinstatement)
```

`active` is operational status; live eligibility additionally requires compliance approval and valid live environment/key.

## KYC

```text
not_started
  → in_progress
  → submitted
  → under_review
  ├─→ needs_information → in_progress → submitted
  ├─→ approved
  └─→ rejected
```

A new re-review creates a new review cycle/history; never overwrite prior decisions.

## Payment

Canonical public statuses:

```text
created → pending → paid
                 ├→ expired
                 └→ failed
```

Internal operational state may additionally use `reconciliation_required` when provider outcome is ambiguous.

Rules:
- `paid`, `expired`, `failed` are terminal for v0.x;
- terminal state never regresses;
- duplicate same terminal event is no-op;
- late provider events that conflict are audit/reconciliation input, not blind state mutation;
- exact late-paid-after-expiry business behavior must be explicit before implementation.

## ProviderAttempt

```text
created → sent
sent → succeeded
sent → definitive_failed
sent → ambiguous
```

`definitive_failed` may permit controlled fallback when routing policy says so. `ambiguous` never permits blind fallback.

## PaymentLink

```text
draft → active → disabled
active → expired       (only when lifetime expiry exists)
```

Unlimited link has no terminal expiry from child Payment.

## Order

```text
pending_payment → paid
                ├→ payment_failed
                ├→ expired
                └→ cancelled
```

Order transition follows canonical payment outcome but remains a distinct business aggregate.

## ProviderMerchantAccount

```text
not_required
pending → under_review → active
                     ├→ rejected
active → suspended
suspended → active
```

## WebhookDelivery

```text
pending → delivering → delivered
                     └→ retry_scheduled → delivering
retry_scheduled → dead_letter
```

Retries must be deduplicated by delivery identity.

## Payout (future activation)

Architecture-only until custody ADR accepted:

```text
requested → processing → completed
                       ├→ failed
                       ├→ rejected
                       └→ cancelled
```

No payout transition may move ledger funds without atomic ledger evidence.
