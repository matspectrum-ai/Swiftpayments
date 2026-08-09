# Domain Model

## 1. Bounded contexts

### Identity & Access
`UserIdentity`, `MerchantMembership`, `AdminRoleAssignment`, `ApiKey`, `SecurityEvent`.

### Merchant & Compliance
`Merchant`, `MerchantProfile`, `KycCase`, `KycPendingItem`, `KycDecision`, `RiskAssessment`, `ProviderMerchantAccount`, `SplitRecipientEligibility`.

### Catalog & Commerce
`Product`, `Checkout`, `CheckoutProduct`, `PaymentLink`, `Order`, `OrderItem`, `CustomerSnapshot`.

### Payments
`Payment`, `PixDetails`, `ProviderAttempt`, `ProviderEvent`, `RoutingDecision`, `IdempotencyRecord`.

### Providers
`Provider`, `ProviderConnection`, `ProviderCapability`, `ProviderMerchantAccount`, `ProviderSplitExecution`, provider adapter models.

### Pricing
`PlatformFeeRule`, `MerchantFeeOverride`, `ProviderCostRule`, `FeeSnapshot`.

### Split
`SplitRecipient`, `SplitRule`, `SplitRuleRecipient`, `PaymentSplitSnapshot`, `PaymentSplitAllocation`, `SplitExecution`, `SplitReconciliation`.

### Events/Webhooks
`DomainEvent`, `OutboxMessage`, `WebhookEndpoint`, `WebhookDelivery`, `ProviderWebhookLog`.

### Financial Integrity
`LedgerAccount`, `LedgerEntry`, `ReconciliationRun`, `ReconciliationDifference`, `Payout` — internal custody activation depends on settlement ADR.

### Operations
`Notification`, `DashboardCache`, `AuditEvent`, `OperationalIncident`.

## 2. Aggregate ownership

### Merchant
Tenant/operational lifecycle. Operational active != compliance approval. Suspension blocks live operations.

### KycCase
Owns submitted evidence/review history. Decisions append-only; merchant cannot self-approve.

### Order
Owns commerce snapshot. API direct Payment has no Order. `Order.total_amount == Payment.amount` when linked.

### Payment
Canonical Pix aggregate. Owns merchant/environment/origin, gross amount, canonical status, Pix metadata, `fee_snapshot_id`, `split_snapshot_id?`, routing result and timestamps. Public model never exposes provider-specific execution.

### FeeSnapshot
Immutable price/cost facts applied to Payment.

### SplitRule
Versioned reusable allocation policy belonging to one merchant/environment. It references pre-registered eligible recipients, not provider-specific recipient IDs.

A rule is mutable only by creating a new version/effective period; historical Payments never point to rewritten economics.

### SplitRecipient
Canonical beneficiary identity recognized by Swiftpay. May represent merchant itself or an approved recipient/submerchant relationship. Provider mappings live separately.

### PaymentSplitSnapshot
Immutable allocation plan frozen for one Payment after fee resolution and before provider create transmission.

Contains:
- gross amount;
- platform fee;
- `splittable_amount_minor`;
- calculation mode/version;
- rule/version reference;
- exact allocation per canonical recipient;
- rounding remainder assignment;
- execution strategy intent.

Invariant: allocation sum equals `splittable_amount_minor` exactly.

### SplitExecution
Records how the canonical snapshot was executed: `native_provider` or `internal_ledger`. Does not redefine economic entitlement.

### ProviderAttempt
One concrete provider operation. Owns provider IDs, request/outcome class, latency, raw refs and ambiguity.

### RoutingDecision
Immutable provider eligibility/selection explanation; split compatibility is an eligibility input.

### PaymentLink
Reusable public config, never a Payment. May reference a SplitRule version/config that is resolved/snapshotted only when child Payment is created.

## 3. Split arithmetic modes

One SplitRule uses one mode:

- `percentage`: recipient bps sum exactly `10000`; allocation uses integer floor, then deterministic remainder to designated remainder recipient;
- `fixed`: fixed allocations are non-negative and total <= splittable amount; exactly one remainder recipient receives residual.

No mixed implicit arithmetic in one rule version. New arithmetic requires versioned contract/ADR.

## 4. Fee vs split

Canonical order:

```text
gross_amount
  - platform_fee
  = splittable_amount
  → split allocations
```

`provider_cost` is an internal Swiftpay cost affecting margin, not recipient entitlement, unless a future explicit pricing ADR changes merchant economics.

## 5. Provider abstraction

Canonical recipients/allocations never store provider-specific submerchant IDs in public/domain contracts. Provider mapping translates canonical recipient to provider recipient/subaccount identifiers.

## 6. Environment and money

Commercial environments: `test|live`. Deployment environment is separate. Every Payment, rule, recipient eligibility, provider connection, routing/split decision, webhook/outbox async command is environment-scoped.

Money = integer BRL centavos. Percentage = integer bps. No floating-point canonical arithmetic.
