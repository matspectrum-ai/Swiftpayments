# KYC, KYB, Compliance and Admin Approval

## 1. Principle

Live payment processing requires an explicit compliance decision by authorized Swiftpay staff. KYC is a domain workflow, not a `verified=true` field.

Exact legal obligations depend on Swiftpay's regulatory/commercial role; legal conclusions remain outside code assumptions.

## 2. Onboarding

Merchant onboarding persists incrementally. Submission is a separate action.

Suggested flow:

```text
user identity
→ merchant profile
→ PF/PJ subject data
→ address/contact
→ documents
→ business/payment profile
→ submit
→ compliance review
```

## 3. PF KYC

Potential evidence/fields:
- legal name;
- CPF;
- birth date;
- email/phone;
- address;
- RG/CNH document;
- document front/back as applicable;
- optional selfie/liveness/face match through external verification provider.

## 4. PJ KYB

Potential evidence/fields:
- CNPJ;
- legal/trade name;
- incorporation/business data;
- registered address/contact;
- representatives;
- shareholders/beneficial owners;
- CNPJ card/company documents;
- representative identity evidence.

Required fields are frozen only after PF/PJ launch scope and legal/provider requirements are known.

## 5. Review workflow

Admin actions:
- approve;
- reject;
- request information by `field_key`/document;
- suspend;
- reopen/re-review.

`needs_information` items are structured so merchant UI edits only relevant requested evidence where policy requires.

## 6. Decision record

Every decision captures:
- case/merchant;
- decision;
- reason code;
- notes;
- reviewer;
- timestamp;
- source/risk flags;
- audit event.

History is immutable.

## 7. Live gate

Payment API validates live eligibility on every live create. A previously issued key does not bypass later suspension/compliance revocation.

## 8. Provider external onboarding

Provider may require submerchant/subaccount. Keep this separate from Swiftpay KYC:

`Swiftpay KYC approval != ProviderMerchantAccount active`.

Router may require both.

Provider-specific external KYC submission lives behind `ProviderMerchantAdapter` capabilities, not admin endpoint hardcoding.

## 9. KYC storage

- private by default;
- metadata in database, bytes in Supabase Storage;
- authorized short-lived signed URLs for human access;
- longer signed URLs for provider KYC only when provider contract requires it and security/compliance accepts duration;
- never send private storage path as a public URL;
- log access to sensitive documents where required;
- define retention/deletion legally.

## 10. Biometrics

Biometric/liveness data is highly sensitive. Do not build proprietary face matching in initial implementation. Use vetted provider if required; store minimum necessary evidence/results.

## 11. Admin roles

Minimum conceptual roles:
- `platform_owner`;
- `platform_admin`;
- `compliance_admin`;
- `operations_admin`;
- `support`.

Only allowed compliance roles can decide KYC. High-risk four-eyes approval can be added without changing KycCase model.

## 12. Audit

Audit at minimum:
- KYC decisions;
- suspension/reinstatement;
- provider binding/readiness changes;
- fee/routing changes;
- credential/API key administrative actions;
- manual reprocessing/reconciliation actions.
