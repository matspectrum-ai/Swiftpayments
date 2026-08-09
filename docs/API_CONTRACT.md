# Public Payments API Contract

Base: `https://api.swiftpay.com/v1`

## Authentication

```http
Authorization: Bearer sk_live_...
```

Test keys use `sk_test_...`. A key resolves exactly one merchant + commercial environment.

Revoked/rotated keys stop authenticating immediately.

## Required live gates

Before any live create:

```text
valid key
AND key.environment == live
AND merchant operationally active
AND compliance approval valid
AND Pix enabled for merchant/platform
```

## POST `/payments`

`Idempotency-Key` is mandatory.

Request:

```json
{
  "amount": 1000,
  "currency": "BRL",
  "external_id": "PED-12345",
  "description": "Pedido 12345",
  "customer": {
    "name": "Joao da Silva",
    "email": "joao@example.com",
    "phone": "5511999999999",
    "document": "01111111111"
  },
  "metadata": {
    "order_id": "12345"
  }
}
```

Canonical response:

```json
{
  "id": "pay_...",
  "object": "payment",
  "external_id": "PED-12345",
  "status": "pending",
  "amount": 1000,
  "currency": "BRL",
  "pix": {
    "copy_paste": "000201...",
    "qr_code": { "base64": "data:image/png;base64,..." },
    "expires_at": "2026-08-09T15:30:00Z"
  },
  "created_at": "2026-08-09T15:00:00Z"
}
```

Provider/acquirer identity, raw status, provider attempts and provider IDs are forbidden in this response.

## GET `/payments/{payment_id}`

Returns canonical payment. Tenant-scoped.

## GET `/payments`

Filters P0:
- `external_id`;
- `status`;
- created time range where justified;
- cursor.

Use cursor pagination, not deep offset pagination.

## Idempotency

Namespace: merchant + environment + key.

- same key + same canonical request fingerprint → same semantic resource/result;
- same key + different fingerprint → `409 IDEMPOTENCY_CONFLICT`;
- concurrent first requests must be serialized by DB uniqueness/locking, not race-prone application checks.

## Errors

Envelope:

```json
{
  "error": {
    "code": "merchant_not_approved",
    "message": "Merchant is not enabled for live payments.",
    "request_id": "req_..."
  }
}
```

Canonical codes include:
- `authentication_failed`;
- `api_key_revoked`;
- `merchant_not_approved`;
- `merchant_suspended`;
- `validation_error`;
- `idempotency_conflict`;
- `rate_limit_exceeded`;
- `payment_not_found`;
- `provider_unavailable`;
- `payment_reconciliation_required`;
- `internal_error`.

Do not expose raw provider error text unless explicitly safe and normalized.

## Rate limiting

Rate limit policy is configurable by admin/merchant tier. The API returns `429` and `Retry-After`. Exact defaults are operational config, not hardcoded product law.

## Request correlation

Return a request/correlation ID header and include request id in error envelopes.

## OpenAPI

`openapi.yaml` becomes the machine-readable source when implementation phase begins. Hand-written docs must be generated/validated against OpenAPI, not drift independently.
