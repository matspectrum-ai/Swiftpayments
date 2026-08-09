# FlevoPay Provider Mapping — P0

FlevoPay is both a production provider target and a DX/reference input. This document records known mapping direction; provider fixtures/tests become authoritative during adapter implementation.

## Known public provider patterns

Reference documentation supplied earlier indicates:
- API key authentication;
- create Pix transaction endpoint;
- integer amount in centavos;
- external/reference field;
- QR copy/paste and base64 QR;
- expiration;
- transaction query/search;
- provider/acquirer and raw attempts visible in Flevo payload;
- provider statuses including approved/pending/etc;
- webhooks with transaction/external IDs and raw status.

## Swiftpay normalization

| Flevo concept | Swiftpay canonical |
|---|---|
| transaction create | `PixProvider.createPayment` |
| reference/external id | `external_id` |
| qr code string | `pix.copy_paste` |
| base64 qr | `pix.qr_code.base64` |
| approved | `paid` |
| provider/acquirer name | internal only |
| attempts/raw status | internal ProviderAttempt/log only |

## Rules

- Swiftpay API does not require Swiftpay Product for API-direct payment.
- Flevo-specific order bump/split/recurring/tracking fields are not P0 provider contract inputs.
- Flevo raw status is stored internally where needed for audit, not exposed.
- Idempotency is enforced by Swiftpay regardless of provider capability.
- Automatic retry of create requires verified provider idempotency behavior; otherwise ambiguous transport outcome is reconciled.

## Implementation gate

Before GREEN adapter:
- capture sanitized create/query/error/webhook fixtures;
- freeze exact auth/header/base URL configuration;
- classify all provider statuses seen in docs/fixtures;
- document webhook authentication;
- verify lookup path usable for ambiguous create reconciliation.
