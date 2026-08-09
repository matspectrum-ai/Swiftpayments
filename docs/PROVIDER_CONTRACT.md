# Pix Provider Contract

## 1. Goal

FlevoPay, AkkadPag and future Pix providers must be substitutable behind one canonical contract. Provider-specific details remain inside adapters.

## 2. Mandatory layering

```text
ProviderClient        HTTP transport only
ProviderSchemas       external request/response/webhook runtime schemas
ProviderParser        response/error extraction and provider aliases
ProviderStatusMapper  provider status → canonical status
ProviderAdapter       implements PixProvider and orchestration glue
```

No payment state machine inside HTTP client.

## 3. Canonical port

Conceptual TypeScript contract:

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

No method returns raw provider model as canonical result.

## 4. Create result classification

```ts
type ProviderCreatePaymentResult =
  | { kind: 'created'; externalId: string; pix: CanonicalPix; rawRef?: RawLogRef }
  | { kind: 'definitive_failure'; error: CanonicalProviderError; rawRef?: RawLogRef }
  | { kind: 'ambiguous'; reason: string; correlationRef?: string; rawRef?: RawLogRef };
```

The `ambiguous` class is mandatory. A timeout/network reset after request transmission is not automatically `definitive_failure`.

## 5. Canonical statuses

Provider mappings target:

- `pending`;
- `paid`;
- `expired`;
- `failed`;
- `unknown` (internal mapping result requiring investigation, never financial mutation by itself).

Unknown provider status must not be guessed into `paid`.

## 6. Webhooks

Each provider declares supported auth modes, e.g. token, IP, token+IP, HMAC. Authentication happens before domain mutation.

Raw authenticated webhook is stored/audited with secrets masked before/alongside canonical processing according to retention/security policy.

Parsing supports documented provider aliases/nesting but remains provider-specific.

## 7. Provider merchant account capability

Capabilities may include:

```yaml
requires_external_merchant: boolean
supports_create_pix: true
supports_query_pix: boolean
supports_webhook: boolean
supports_provider_idempotency: boolean
```

If external merchant is required, router checks `ProviderMerchantAccount.status == active`.

## 8. Retries/resilience

Policy is per operation:

- safe GET/query may use retry with bounded backoff;
- create Pix may retry only when provider contract proves idempotency for the same provider operation;
- otherwise ambiguous transport outcomes enter reconciliation;
- circuit breaker may exclude definitively unhealthy providers from new selections.

## 9. Required conformance tests

Every adapter runs the same suite:

- valid create normalizes to canonical Pix;
- query normalizes statuses;
- provider fields do not leak;
- errors map to canonical classes;
- webhook auth rejects invalid source/signature/token;
- documented webhook fixtures parse;
- duplicate webhook processing is safe;
- unknown status cannot become paid;
- ambiguous timeout returns `ambiguous`;
- provider idempotency behavior tested if claimed;
- external merchant readiness enforced if required.

## 10. FlevoPay

Known reference patterns are mapped in provider-specific fixtures/spec. Public Flevo fields such as acquirer/raw status/attempts are not propagated into Swiftpay public payload.

## 11. AkkadPag

Adapter remains RED/blocked until complete field-level documentation and sanitized fixtures are available. No invented contract fields.
