# Logical Data Model

Minimum physical contract migrations should materialize after RED DB tests.

## Schemas

```text
core         merchants/users/settings
compliance   KYC/risk/recipient eligibility
commerce     products/checkouts/payment_links/orders
payments     payments/idempotency/events/webhooks
providers    providers/connections/attempts/provider split execution
billing      fees + split rules/snapshots
ops          audit/dashboard/reconciliation
ledger       accounts/entries/payouts (feature-gated)
```

## Core

### `core.merchants`
`id`, `public_id`, status/legal type/display name/timestamps/suspension.

### `core.merchant_memberships`
Unique `(merchant_id,user_id)` with constrained role.

### `core.admin_role_assignments`
Server-managed admin roles.

### `core.api_keys`
merchant/environment, prefix, secret verifier, status, created/revoked/last_used. Full secret not retrievable.

## Compliance

`compliance.kyc_cases`, `kyc_evidence`, `kyc_pending_items`, append-only `kyc_decisions`, `provider_merchant_accounts`.

### `compliance.split_recipient_eligibility`
- `recipient_id`;
- `merchant_id` owner relationship;
- environment;
- compliance status;
- live eligibility;
- reason/audit metadata;
- provider onboarding requirements may remain separate.

## Commerce

`products`, `checkouts`, `payment_links`, `orders`, `order_items` remain tenant/environment scoped.

Products/checkouts/payment-links may reference an active `split_rule_id`; child Payment stores only immutable snapshot result, never relies on future rule reads for historical economics.

## Payments

### `payments.payments`
- UUID PK + public ID;
- merchant/environment;
- optional order;
- origin `api|checkout|payment_link`;
- external id;
- amount minor >0, BRL;
- canonical status/Pix metadata;
- `fee_snapshot_id` NOT NULL;
- `split_snapshot_id` nullable when no split;
- routing decision;
- timestamps.

### `payments.idempotency_records`
Unique `(merchant_id,environment,key)`. Fingerprint includes every economic input affecting Payment, including `split_rule_id/version` or resolved split request reference.

### `payments.outbox_messages`, `webhook_endpoints`, `webhook_deliveries`
Environment-scoped and durable.

## Providers

### `providers.providers`
Includes Pix capability and split capability metadata.

### `providers.provider_connections`
provider/environment/scope/status/secret refs/priority/config.

### `providers.provider_attempts`
payment/provider/operation/outcome/provider IDs/latency/error/raw refs.

### `providers.provider_recipient_mappings`
Canonical `split_recipient_id` → provider-specific recipient/submerchant identifier, environment, status/capabilities. Provider identifier is internal only.

### `providers.provider_split_executions`
- payment split snapshot;
- provider attempt/provider;
- execution status;
- external split/batch refs;
- sanitized response/raw log refs;
- submitted/confirmed timestamps;
- immutable expected allocation reference.

### `providers.provider_webhook_logs`, `routing_decisions`
Dedicated audit/decision evidence.

## Billing — fees

### `billing.platform_fee_rules`
context `pix_api|pix_checkout|pix_payment_link`, fixed minor, percentage bps, effective window/status/version.

### `billing.merchant_fee_overrides`
merchant/context/effective window/version.

### `billing.provider_cost_rules`
provider + optional merchant/provider account, fixed/percentage, effective/version.

### `billing.fee_snapshots`
immutable gross/platform fee/provider cost/economic net/margin/rule refs/calculation version.

## Billing — split

### `billing.split_recipients`
Canonical recipient record: public ID, owner merchant relationship/type, display metadata safe for merchant UI, status, created/disabled timestamps. No provider credential IDs in public DTOs.

### `billing.split_rules`
- merchant/environment;
- public id/name;
- mode `percentage|fixed`;
- version;
- status `draft|active|superseded|disabled`;
- designated remainder recipient;
- effective timestamps;
- created_by/audit refs.

### `billing.split_rule_recipients`
- rule version;
- canonical recipient;
- `percentage_bps` OR `fixed_amount_minor` according to rule mode;
- deterministic ordering;
- uniqueness `(split_rule_id,recipient_id)`.

DB checks enforce allowed field combination; application + DB acceptance verifies percentage sum 10000 for active percentage rules.

### `billing.payment_split_snapshots`
- payment;
- rule id/version nullable for ad-hoc future contract;
- gross minor;
- platform fee minor;
- splittable minor;
- mode/calculation version;
- remainder minor/recipient;
- strategy `native_provider|internal_ledger`;
- frozen_at.

Unique one snapshot per split-enabled Payment.

### `billing.payment_split_allocations`
- snapshot;
- canonical recipient;
- basis value (bps/fixed);
- final allocated minor;
- deterministic ordinal;
- execution status/reference.

Unique `(snapshot_id,recipient_id)`. DB/transaction validation must guarantee sum(final allocated) == snapshot.splittable minor before snapshot becomes frozen.

## Ops

`audit_events`, `dashboard_cache`, `notifications` plus split reconciliation evidence.

### `ops.split_reconciliation_differences`
Expected snapshot allocation vs provider/ledger evidence; recipient, expected, actual, difference, severity, resolution/audit.

## Ledger feature gate

`ledger.accounts`, `entries`, reconciliation and payouts activate only if internal settlement/custody strategy is accepted. Provider-native split does not by itself justify inventing internal withdrawable balances.

## Retention

Financial/audit/compliance deletion/retention follows legal policy. Soft-delete cannot erase immutable financial history.
