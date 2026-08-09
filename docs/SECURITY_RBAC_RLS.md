# Security, RBAC and RLS

## 1. Identity domains

### Humans
Supabase Auth authenticates merchant/admin humans.

### Merchant systems
Swiftpay API keys authenticate external systems to `payment-api`.

### Internal services
Use separately scoped service credentials/network policy; never reuse merchant API keys.

## 2. Authorization

Authentication is not authorization.

Server resolves:
- user identity;
- merchant membership;
- merchant role;
- admin role assignment;
- merchant/compliance operational state.

Admin privilege must not come from user-editable metadata.

## 3. Tenant isolation

Every merchant-owned resource has merchant ownership. Queries are scoped on server. RLS provides additional browser-facing protection.

Cross-tenant access must have explicit negative tests.

## 4. RLS

RLS policies are required for browser-accessible tables/views. Service-role bypass is restricted to trusted backend processes. Do not expose broad base tables when a minimal view/RPC is safer.

## 5. API keys

- prefix identifies class/environment;
- secure random secret;
- display full secret once;
- store verifier/hash where practical;
- rotation/revocation immediate;
- last-used timestamp/metadata;
- no browser client stores live secret except deliberate developer UI one-time display.

## 6. Secrets

Provider credentials, webhook secrets and service keys are secret references. Never persist them as plaintext in general config JSON or logs.

## 7. KYC/privacy

KYC documents private. Signed URL authorization checks uploader/merchant/admin/compliance scope. Sensitive logs are minimized and redacted.

## 8. Webhook security

- authenticate provider ingress before financial mutation;
- sign merchant egress;
- use replay protections where signature scheme supports timestamps/nonces;
- SSRF-safe validation for merchant webhook URLs;
- private/link-local/metadata IP protection on outbound webhook resolution.

## 9. Rate limiting

Apply to auth-sensitive and create-payment endpoints. Rate policy cannot be the only fraud/security control.

## 10. Dependency policy

Stable/GA versions only unless an ADR explicitly approves prerelease. Automated dependency and secret scanning in CI.

## 11. Logging policy

Two classes:

1. structured technical telemetry for operations/errors/performance;
2. durable audit/business logs for privileged or financially material actions.

Do not suppress useful warning/info telemetry globally; instead control sampling/retention. Secrets and personal documents are always masked.

## 12. Threat checklist

Every security-sensitive change considers:
- tenant breakout;
- broken object authorization;
- API key theft/replay;
- webhook spoofing/replay;
- SSRF;
- provider credential leakage;
- KYC document exposure;
- SQL injection;
- mass assignment;
- idempotency abuse;
- race conditions/concurrent state transitions;
- admin privilege escalation.
