# Open Questions / Stakeholder Blockers

Agents may ask stakeholders about these items when implementation reaches the affected gate. Do not repeatedly ask about decisions already frozen in `DECISIONS.md`.

## BLOCKER-01 — AkkadPag field-level contract

Need complete current documentation/fixtures for authentication, Pix creation, query, errors, webhook authentication and statuses before the AkkadPag adapter can move from contract tests RED to GREEN.

## BLOCKER-02 — Settlement/custody model

Define whether provider(s) settle directly to merchant, Swiftpay receives/redistributes funds, or a provider subaccount/split arrangement is used. This determines when ledger balance, reserve and payout domains become operationally P0.

## BLOCKER-03 — Fee collection mechanics

Fee calculation is specified independently; exact collection/retention mechanics depend on provider contracts and settlement model.

## BLOCKER-04 — KYC automation level

Manual review is allowed for initial delivery. Decide whether launch requires third-party OCR/document validation/liveness/biometric verification.

## BLOCKER-05 — PF/PJ release scope

Architecture supports both KYC and KYB. Decide whether initial live onboarding is PF-only, PJ-only or both before implementing final required-field validation.

## BLOCKER-06 — Provider submerchant model

Determine whether FlevoPay and/or AkkadPag require one external submerchant/account per Swiftpay merchant and what lifecycle/capabilities apply.

## BLOCKER-07 — Production hosting

Choose final hosting for the two Fastify services and three Next.js surfaces after foundation benchmarks and operational constraints are known.
