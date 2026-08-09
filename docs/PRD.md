# Swiftpayments PRD — Pix-only Multi-Provider Payment Platform

## 1. Product statement

Swiftpayments is a Pix-only payment platform giving merchants one stable integration and one operational dashboard while Swiftpay manages providers, routing, fees, split, compliance, reconciliation and payment-event delivery.

Primary providers v0.x: **FlevoPay** and **AkkadPag**.

## 2. Personas

### Merchant owner/operator
Needs onboarding/KYC, products, checkout/payment links, transactions, split rules/recipients, API keys, webhooks and fees without provider complexity.

### Merchant developer
Needs predictable Pix API, idempotency, optional preconfigured split, signed webhooks and test/live isolation.

### Buyer
Needs fast hosted Pix QR/copy-paste and reliable paid-state confirmation.

### Swiftpay owner/admin
Needs merchant/KYC/provider/routing/fee/split/transaction/reconciliation/audit controls.

### Compliance/operations
Needs review queues, documents, risk flags, recipient eligibility, approval/suspension and auditability.

## 3. Product surfaces

| Surface | Responsibility |
|---|---|
| `app.swiftpay.com` | merchant dashboard |
| `admin.swiftpay.com` | internal admin/compliance/ops |
| `api.swiftpay.com` | public Pix API |
| `pay.swiftpay.com` | hosted checkout/payment links |

## 4. P0 capabilities

- signup/signin, merchants/membership;
- KYC/KYB and manual approval/rejection/needs-info/suspension;
- test/live isolation;
- products, checkouts, reusable payment links and Orders;
- direct Pix API payments;
- canonical Payment state;
- FlevoPay + AkkadPag adapters;
- safe routing/failover;
- API keys + immediate revocation;
- payment idempotency;
- provider webhook normalization;
- signed merchant webhooks/retry history;
- Fee Engine: platform fee vs provider cost;
- **Split Engine:** preconfigured split rules, eligible recipients, immutable payment split snapshots, provider-native execution where supported, reconciliation evidence;
- merchant/admin transaction and split views;
- private KYC storage;
- dashboard KPIs;
- correlation/health/metrics/runbooks;
- reconciliation primitives.

## 5. Pix-only constraint

Pix is the only payment rail. This does not remove financial-platform domains such as fees, split, provider subaccounts, settlement or ledger when commercially/legal required.

## 6. Primary flows

### No-code
`signup → onboarding/KYC → admin approval → product → optional split rule → checkout/link → buyer confirms → Order → Payment + fee/split snapshots → Router → Provider → webhook → canonical paid → reconciliation/event delivery`.

### Developer
`approved merchant → key → POST /v1/payments + Idempotency-Key + optional split_rule_id → canonical Pix → signed webhook → GET payment`.

### Split
`admin/merchant configures eligible recipients → create/version SplitRule → Payment creation resolves fee → freezes SplitSnapshot → router selects split-compatible provider → provider-native split OR approved ledger settlement strategy → reconcile expected vs executed allocations`.

## 7. Success criteria

- Merchant never needs provider-specific knowledge.
- Same public semantics regardless of provider.
- Idempotent create cannot create second semantic Payment.
- Ambiguous provider create cannot blind-fallback.
- Duplicate/out-of-order webhooks cannot regress terminal state.
- Unapproved/suspended merchant cannot process live.
- Provider cost is internal.
- Fee and split are deterministic, versioned, auditable and immutable per Payment.
- Sum of split allocations equals canonical splittable amount exactly.
- Split is never silently discarded when provider changes/fallback occurs.
- Every privileged KYC/fee/split/provider/routing change is audited.

## 8. Performance targets

Budgets to verify, not promises:
- indexed GET platform overhead p95 <150ms;
- internal write excluding provider I/O p95 <200ms;
- create-payment Swiftpay overhead p95 <100ms excluding provider latency;
- no N+1 hot paths;
- provider latency measured independently.

## 9. Deferred but architecture-ready

- internal custodial wallet/balance if not required for split execution;
- Pix-out payout/cashout when settlement model requires it;
- reserves/compensation;
- refund;
- referrals/rankings/achievements;
- tracking integrations;
- advanced ML routing;
- automated KYC vendor integrations.

## 10. Explicit non-goals

- card;
- boleto;
- subscriptions outside Pix scope;
- marketplace discovery/storefront ecosystem (the Split Engine itself is P0);
- hidden financial behavior;
- provider details in merchant contracts;
- infrastructure-heavy microservices.
