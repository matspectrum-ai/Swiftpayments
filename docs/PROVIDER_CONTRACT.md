# Pix Provider Contract

## 1. Goal
FlevoPay, AkkadPag and future Pix providers are substitutable behind one canonical contract. Provider details remain inside adapters.

## 2. Layering
`ProviderClient (HTTP only) → ProviderSchemas → ProviderParser → ProviderStatusMapper → ProviderAdapter`.

## 3. Canonical port

```ts
interface PixProvider {
  readonly code: ProviderCode;
  readonly capabilities: PixProviderCapabilities;
  createPayment(input: ProviderCreatePaymentInput): Promise<ProviderCreatePaymentResult>;
  getPayment(input: ProviderGetPaymentInput): Promise<ProviderGetPaymentResult>;
  authenticateWebhook(input: ProviderWebhookRequest): Promise<ProviderWebhookAuthResult>;
  parseWebhook(input: ProviderWebhookRequest): Promise<CanonicalProviderEvent>;
}
```

`ProviderCreatePaymentInput` may contain a canonical `splitPlan` derived from immutable PaymentSplitSnapshot. It never contains public/provider-mixed models.

## 4. Create result

`created | definitive_failure | ambiguous`. Timeout/reset after possible transmission is not automatically definitive failure. Ambiguous stops fallback.

## 5. Canonical statuses
`pending | paid | expired | failed | unknown`. Unknown cannot produce financial mutation.

## 6. Capabilities

Every adapter declares verified capabilities:

```yaml
requires_external_merchant: boolean
supports_create_pix: true
supports_query_pix: boolean
supports_webhook: boolean
supports_provider_idempotency: boolean
supports_native_split: boolean
supports_percentage_split: boolean
supports_fixed_split: boolean
requires_split_recipient_subaccount: boolean
max_split_recipients: integer|null
```

Capabilities cannot be claimed from guesswork; documentation/fixtures/conformance evidence required.

## 7. Canonical split port

When `supports_native_split=true`, adapter maps:

```text
PaymentSplitSnapshot
  → canonical recipient allocations
  → provider recipient mapping/submerchant IDs
  → provider request
```

Rules:
- provider IDs never replace canonical recipient IDs in domain state;
- mappings must be active for environment;
- adapter must preserve exact intended economic allocation according to provider fee semantics;
- if provider cannot represent the snapshot exactly, provider is ineligible before send;
- no adapter may silently drop/merge a recipient or change allocation to make request pass.

Provider result records execution evidence separately from canonical snapshot.

## 8. Webhooks
Provider auth is verified before mutation. Raw authenticated payload is audited with secret masking. Parsing aliases/nesting is provider-specific.

## 9. External merchant/subaccount
If provider requires external merchant/recipient onboarding, router checks active ProviderMerchantAccount/provider recipient mappings before selection.

## 10. Retry/resilience
Safe query may retry. Create Pix may retry only with proven same-provider idempotency. Otherwise ambiguous outcome enters reconciliation.

## 11. Shared conformance suite

Every adapter:
- create/query/status/error normalization;
- provider fields do not leak;
- webhook auth/fixtures/duplicate behavior;
- unknown != paid;
- ambiguous timeout classification;
- provider idempotency if claimed;
- external merchant readiness if required.

If native split claimed, also:
- exact percentage allocation mapping;
- fixed mode only if claimed;
- max recipient enforcement;
- missing recipient mapping rejected before HTTP send;
- provider fee semantics cannot alter canonical recipient entitlement silently;
- execution response normalized without leaking provider IDs;
- ambiguous split create enters reconciliation;
- no fallback to non-split-capable provider.

## 12. FlevoPay/AkkadPag
FlevoPay mapping uses only documented/fixture-backed fields. AkkadPag remains RED for unknown field-level behaviors until docs/fixtures exist. Split capability for either provider is `unknown/false-for-routing` until verified; never assume support.
