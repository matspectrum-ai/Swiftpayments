# Domain Model

## 1. Bounded contexts

### Identity & Access
`UserIdentity`, `MerchantMembership`, `AdminRoleAssignment`, `ApiKey`, `TrustedDevice` (optional), `SecurityEvent`.

### Merchant & Compliance
`Merchant`, `MerchantProfile`, `KycCase`, `KycPendingItem`, `KycDecision`, `RiskAssessment`, `ProviderMerchantAccount`.

### Catalog & Commerce
`Product`, `Checkout`, `CheckoutProduct`, `PaymentLink`, `Order`, `OrderItem`, `CustomerSnapshot`.

### Payments
`Payment`, `PixDetails`, `ProviderAttempt`, `ProviderEvent`, `RoutingDecision`, `IdempotencyRecord`.

### Providers
`Provider`, `ProviderConnection`, `ProviderCapability`, `ProviderMerchantAccount`, provider-specific adapter models.

### Pricing
`PlatformFeeRule`, `MerchantFeeOverride`, `ProviderCostRule`, `FeeSnapshot`.

### Events/Webhooks
`DomainEvent`, `OutboxMessage`, `WebhookEndpoint`, `WebhookDelivery`, `ProviderWebhookLog`.

### Financial Integrity
`LedgerAccount`, `LedgerEntry`, `ReconciliationRun`, `ReconciliationDifference`, `Payout` — architecture-ready; activation depends on custody/settlement ADR.

### Operations
`Notification`, `DashboardCache`, `AuditEvent`, `OperationalIncident`.

### Extension domains (disabled by default)
`MerchantIntegration`, `Referral`, `Ranking`, `Achievement`.

## 2. Core aggregate ownership

### Merchant
Owns operational eligibility, profile and high-level lifecycle. It does not own KYC evidence history; `KycCase` does.

Invariants:
- one merchant is a tenant boundary;
- status and compliance status are distinct;
- `active` alone is insufficient for live payment if compliance gate is invalid;
- suspension blocks new live operations immediately.

### KycCase
Owns submitted identity/business evidence and review lifecycle.

Invariants:
- submitted evidence versions are auditable;
- decisions are append-only history, not one mutable boolean;
- rejection/needs-info requires reason metadata;
- merchant cannot approve itself.

### Order
Commercial context for hosted checkout.

Owns:
- product snapshots;
- quantities;
- customer snapshot;
- checkout/payment-link origin;
- total amount.

Invariants:
- API direct payment has no Order;
- checkout-confirmed flow creates Order before Payment;
- snapshot values do not change when Product later changes;
- `Order.total_amount == Payment.amount` for linked order/payment.

### Payment
Canonical financial payment aggregate.

Owns:
- merchant/environment/origin;
- amount/currency;
- canonical status;
- Pix code/expiry metadata;
- fee snapshot reference;
- chosen routing result reference;
- paid/expired/failed timestamps.

Does **not** expose provider-specific fields publicly.

### ProviderAttempt
One concrete attempt against one provider.

Owns provider request/outcome classification, provider IDs, latency, sanitized/raw-reference pointers and ambiguity state.

### RoutingDecision
Immutable explanation of provider eligibility/selection for a Payment command.

### PaymentLink
Reusable public configuration; not a Payment.

Invariants:
- creation does not create Payment;
- start/confirm creates a new Order/Payment according to session/lifetime rules;
- unlimited links can create multiple sequential payments;
- lifetime state is independent from current Payment state.

### FeeSnapshot
Immutable financial calculation applied to a Payment.

Contains gross, platform fee, provider cost if known, merchant economic net, platform economic margin and IDs/versions of applied rules.

## 3. Provider abstraction

Canonical domain knows `ProviderId` only in internal operational objects, never provider payload types.

A provider adapter maps external request/response/webhook/status into canonical contracts.

## 4. Environment

Commercial environments are `test` and `live`. Deployment environments (`local`, `staging`, `production`) are separate concepts.

Every payment, API key, provider connection, routing decision, webhook endpoint, outbox message and async command is environment-scoped.

## 5. Provider merchant/subaccount

Some providers may require external merchant/submerchant onboarding. Model this independently:

```yaml
ProviderMerchantAccount:
  merchant_id: MerchantId
  provider_id: ProviderId
  status: not_required | pending | under_review | active | rejected | suspended
  external_id: string?
  capabilities: []
```

Router eligibility can require `active` when provider capability declares external onboarding mandatory.

## 6. Money

`MoneyMinor = int64-like integer in BRL centavos`.

Percentages: integer basis points (`100 = 1%`).

No float/decimal sent through JSON for canonical amounts.
