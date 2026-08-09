---
applyTo: 'apps/**,packages/security/**,supabase/**'
---
# Security / Compliance Rules

- KYC/live gate on every live payment create.
- Merchant suspension overrides valid API key.
- Admin role assignments are internal and separate from merchant roles.
- Service role/provider secrets never enter browser bundles.
- KYC files private by default.
- Signed URLs generated only after authorization and with minimum necessary TTL.
- Webhook endpoint URLs require SSRF defenses.
- Provider webhook must authenticate before mutation.
- Merchant webhook must be signed.
- Cross-tenant access tests are mandatory.
- Logs mask API keys, tokens, documents, webhook secrets and provider credentials.
- Secret scan failures block merge.
