# Logical Data Model

This is the minimum physical contract migrations should materialize. Exact SQL comes after RED database tests.

## Schemas

Suggested PostgreSQL schemas:

```text
core         merchant/users/settings
compliance   KYC/risk/reviews
commerce     products/checkouts/payment_links/orders
payments     payments/idempotency/events/webhooks
providers    providers/connections/attempts/raw events
billing      fee rules/snapshots
ops          audit/notifications/dashboard/reconciliation
ledger       accounts/entries/payouts (feature-gated)
```

## Core tables

### `core.merchants`
- `id uuid pk`
- `public_id text unique`
- `status text`
- `legal_type text`
- `display_name text`
- `created_at timestamptz`
- `updated_at timestamptz`
- `suspended_at timestamptz?`

### `core.merchant_memberships`
Unique `(merchant_id, user_id)`; role constrained.

### `core.admin_role_assignments`
Admin roles are server-managed and never derived from user-editable metadata.

### `core.api_keys`
- merchant/environment;
- key prefix/identifier;
- secret verifier/hash;
- status;
- created/revoked/last_used timestamps;
- full secret never stored retrievably unless security design explicitly requires encrypted storage.

## Compliance

### `compliance.kyc_cases`
merchant, subject type, state, submitted/review timestamps, risk level.

### `compliance.kyc_evidence`
case, type, stored_file_id, checksum/metadata, created_at.

### `compliance.kyc_pending_items`
case, `field_key`, title, description, opened/resolved timestamps.

### `compliance.kyc_decisions`
append-only decision, reason code/text, reviewer, decided_at.

### `compliance.provider_merchant_accounts`
merchant/provider external onboarding status and external id.

## Commerce

### `commerce.products`
merchant, public_id, name, description, amount_minor, active, optional public image refs.

### `commerce.checkouts`
merchant/environment, public slug, status, config JSON limited to presentation/behavior config.

### `commerce.payment_links`
merchant/environment, token/public id, amount/description or product reference, status, optional lifetime expiry. No mandatory Payment FK.

### `commerce.orders`
merchant/environment, checkout/payment_link origin, customer snapshot JSON, total_minor, status, session id, timestamps.

### `commerce.order_items`
order, product id nullable, product name/image/price snapshots, quantity.

## Payments

### `payments.payments`
- `id uuid pk`, `public_id text unique`;
- merchant/environment;
- order id nullable;
- origin `api|checkout|payment_link`;
- external_id nullable;
- amount_minor bigint check > 0;
- currency fixed `BRL`;
- status;
- Pix copy/paste encrypted-or-protected according to retention policy;
- expires_at, paid_at;
- fee_snapshot_id;
- routing_decision_id;
- timestamps.

Indexes:
- `(merchant_id, environment, created_at desc, id desc)`;
- `(merchant_id, environment, external_id)` when external id present;
- status/time indexes for reconciliation jobs.

### `payments.idempotency_records`
Unique `(merchant_id, environment, key)`. Stores request fingerprint, resource id, semantic result reference and state.

### `payments.outbox_messages`
Unique event id, aggregate id/type, environment, payload, created, published/attempt metadata.

### `payments.webhook_endpoints`
merchant/environment, URL, encrypted signing secret reference, status.

### `payments.webhook_deliveries`
event, endpoint, attempt, status, response code, latency, next retry, sanitized response excerpt.

## Providers

### `providers.providers`
public internal id, code, display name, enabled, Pix capability, webhook auth mode, non-secret config.

### `providers.provider_connections`
provider/environment/scope, status, secret refs, priority/weight/config.

### `providers.provider_attempts`
payment/provider, operation, status/outcome class, provider external ids, latency, error class/code, raw log refs, timestamps.

### `providers.provider_webhook_logs`
provider, auth result, headers sanitized, request body protected, source metadata, correlation id, processing result. Retention policy required.

### `providers.routing_decisions`
payment, eligible set snapshot, selected provider, reason/strategy, health snapshot, created_at.

## Billing

### `billing.platform_fee_rules`
context `pix_api|pix_checkout|pix_payment_link`, fixed minor, percentage bps, effective window, status/version.

### `billing.merchant_fee_overrides`
merchant + context override, effective window/version.

### `billing.provider_cost_rules`
provider + optional merchant/provider account, fixed/percentage cost, effective window/version.

### `billing.fee_snapshots`
immutable gross, platform fee, provider cost, economic net, economic margin, rule references and calculation version.

## Ops

### `ops.audit_events`
append-only privileged/security/business actions: actor, action, target, before/after references or safe diff, reason, correlation, time.

### `ops.dashboard_cache`
scope/merchant/environment, calculated_at, expires_at, processing lease metadata, payload.

### `ops.notifications`
user/merchant scope, type, title, message, read timestamp; never canonical payment truth.

## Ledger feature-gated tables

`ledger.accounts`, `ledger.entries`, `ledger.reconciliation_runs`, `ledger.reconciliation_differences`, `ledger.payouts` are implemented only after settlement/custody decision. Entries are append-only and idempotency is enforced by unique DB constraints, not application pre-checks alone.

## Deletion/retention

Financial/audit/compliance deletion policy must be defined legally. Application soft-delete must never erase required immutable history.
