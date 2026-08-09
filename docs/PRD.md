# Swiftpayments PRD — Pix-only Multi-Provider Platform

## 1. Product statement

Swiftpayments is a Pix-only payment platform that gives merchants one stable integration and one operational dashboard while Swiftpay internally manages providers, routing, fees, compliance, reconciliation and delivery of payment events.

Primary providers for v0.x: **FlevoPay** and **AkkadPag**.

## 2. Personas

### Merchant owner/operator
Needs onboarding, KYC status, products, checkout/payment links, transaction visibility, API keys, webhooks, fees and support without seeing provider-specific complexity.

### Merchant developer
Needs a small predictable API: create Pix, query payment, list/filter payments, receive signed webhooks, test safely and retry idempotently.

### Buyer
Needs a fast hosted Pix checkout with QR/copy-paste and reliable paid-state confirmation.

### Swiftpay owner/admin
Needs full control over merchants, KYC approval, providers, routing, fees, transactions, provider attempts, webhooks, logs, reconciliation, platform settings and operational overrides.

### Compliance/operations
Needs review queues, documents, risk flags, approve/reject/needs-info/suspend actions and complete auditability.

## 3. Product surfaces

| Surface | Responsibility |
|---|---|
| `app.swiftpay.com` | merchant dashboard |
| `admin.swiftpay.com` | internal admin/compliance/ops |
| `api.swiftpay.com` | public Pix API |
| `pay.swiftpay.com` | hosted checkout/payment links |

## 4. P0 capabilities

- human signup/signin;
- merchant creation and onboarding;
- KYC/KYB data/document collection;
- manual Swiftpay approval/rejection/needs-info/suspension;
- test/live environments;
- product catalog minimal enough for checkout;
- checkout configuration;
- reusable payment links;
- direct API Pix payments without product/order requirement;
- canonical Pix payment state;
- FlevoPay and AkkadPag adapters;
- provider routing and safe failover policy;
- API keys and immediate revocation;
- idempotent payment creation;
- provider webhooks and canonical normalization;
- signed merchant webhooks with retry/delivery history;
- fee engine: platform price vs provider cost;
- merchant/admin transaction views;
- provider attempt/audit views in admin;
- private KYC storage;
- dashboard KPIs with async cache refresh;
- correlation IDs, health, metrics and runbooks;
- reconciliation primitives.

## 5. Pix-only constraint

There is no card or boleto product behavior. Do not introduce generic `PaymentMethod` branching unless it provides concrete Pix value. The canonical payment method is effectively constant `pix` in external contracts.

## 6. Primary flows

### No-code

`signup → merchant onboarding → KYC → admin approval → product → checkout/payment link → buyer confirms → Order → Payment → Router → Provider → provider webhook → canonical paid → checkout/dashboard update`.

### Developer

`approved merchant → sk_test/sk_live → POST /v1/payments + Idempotency-Key → canonical Pix response → signed payment webhook → GET payment`.

### Compliance

`submitted KYC → automated/basic checks → review queue → approve | needs_information | reject → audit event → merchant operational gate`.

### Provider operations

`admin provider config → provider connection/credentials → readiness/health → router eligibility → attempt → raw webhook audit → normalization`.

## 7. Success criteria

- Merchant never needs provider-specific integration knowledge.
- Same public request/response semantics regardless of selected provider.
- Same idempotency key and same payload never cause a second semantic payment.
- Unknown/ambiguous provider create outcomes never trigger blind secondary creation.
- Duplicate/out-of-order webhooks cannot regress terminal payment state.
- Unapproved/suspended merchant cannot process live.
- Provider cost is never exposed to merchant.
- Every privileged admin/compliance/fee/provider change is auditable.
- Every critical behavior has traceable tests.

## 8. Performance targets

Targets are budgets to verify, not promises before benchmark:

- indexed internal/public GET platform overhead p95 < 150 ms;
- internal writes excluding provider I/O p95 < 200 ms;
- create-payment Swiftpay overhead p95 < 100 ms excluding provider latency;
- no N+1 on hot paths;
- provider latency measured independently.

## 9. Deferred but architecture-ready

- custodial wallet/balance;
- Pix-out merchant payout/cashout;
- reserves/compensation;
- refunds;
- referrals, rankings, achievements;
- tracking integrations;
- advanced routing experiments/A-B/weights;
- automated KYC vendor integrations.

Deferred means not required for first live vertical, not architecturally forbidden.

## 10. Explicit non-goals

- card;
- boleto;
- subscriptions;
- marketplace split/coproductors;
- hidden financial behavior;
- provider details in merchant contracts;
- infrastructure-heavy microservices.
