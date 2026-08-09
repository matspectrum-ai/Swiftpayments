# Public Payments API Contract

Base: `https://api.swiftpay.com/v1`

## Authentication
`Authorization: Bearer sk_live_...`; test uses `sk_test_...`. Key resolves exactly one merchant/environment and revoked keys fail immediately.

## Live gates
Valid key + live environment + active merchant + valid compliance approval + Pix enabled.

## POST `/payments`

`Idempotency-Key` mandatory.

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
  "split_rule_id": "spr_...",
  "metadata": {"order_id":"12345"}
}
```

`split_rule_id` is optional. When supplied:
- rule belongs to authenticated merchant/environment;
- rule is active and recipients are eligible;
- rule/version is resolved before provider create;
- FeeSnapshot is calculated first;
- PaymentSplitSnapshot is frozen from the resolved version;
- idempotency fingerprint includes the economic split reference/version;
- inline provider recipient/submerchant IDs are forbidden.

v0.x deliberately prefers preconfigured `split_rule_id` over arbitrary inline bank/recipient payloads to keep the public API provider-agnostic and auditable. Inline canonical split requires a future explicit contract revision.

Canonical response remains provider-agnostic:

```json
{
  "id":"pay_...",
  "object":"payment",
  "external_id":"PED-12345",
  "status":"pending",
  "amount":1000,
  "currency":"BRL",
  "pix":{"copy_paste":"000201...","qr_code":{"base64":"data:image/png;base64,..."},"expires_at":"...Z"},
  "created_at":"...Z"
}
```

The public Payment response does not expose provider identity, provider split IDs, provider cost or internal recipient mapping IDs. Merchant dashboard/admin may expose merchant-safe split allocation views via separate authorized endpoints.

## GET `/payments/{payment_id}` / GET `/payments`
Tenant scoped; canonical statuses/filters/cursor. No deep offset.

## Idempotency
Namespace merchant+environment+key. Same fingerprint => same semantic resource; different fingerprint => 409; DB uniqueness/locking protects concurrent first use.

## Errors
Canonical errors include authentication/key/merchant validation, idempotency conflict, rate limit, not found, provider unavailable, reconciliation required, plus:
- `split_rule_not_found`;
- `split_rule_inactive`;
- `split_recipient_not_eligible`;
- `split_provider_unavailable`;
- `split_validation_error`.

Raw provider errors never leak.

## Rate/correlation/OpenAPI
Rate limits are admin policy. Return `429` + `Retry-After`. Correlation/request ID is returned. Machine-readable OpenAPI becomes implementation source of truth when Phase API begins.
