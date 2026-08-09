# Open Questions / Stakeholder Blockers

Agents may ask only when implementation reaches the affected gate; do not repeat frozen decisions.

## BLOCKER-01 — AkkadPag field-level contract
Need current auth/Pix create/query/errors/webhook/status docs/fixtures before adapter GREEN.

## BLOCKER-02 — Settlement/custody model
Define direct provider settlement vs Swiftpay custody/redistribution/provider subaccount model. Determines internal-ledger split, balances/reserves/Pix-out.

## BLOCKER-03 — Fee collection mechanics
Fee arithmetic is frozen; exact retention/collection mechanics depend on provider/settlement contracts.

## BLOCKER-04 — KYC automation level
Decide launch requirement for OCR/document validation/liveness/biometric vendor automation.

## BLOCKER-05 — PF/PJ release scope
Architecture supports KYC/KYB; final required fields depend on launch scope.

## BLOCKER-06 — Provider submerchant model
Determine FlevoPay/AkkadPag external merchant/submerchant lifecycle requirements.

## BLOCKER-07 — Production hosting
Choose final hosting after foundation benchmarks/constraints.

## BLOCKER-08 — FlevoPay native split capability
Need documented contract + sanitized fixtures proving whether native Pix split exists, recipient/submerchant identifiers, fee semantics, limits, rounding and webhook/reconciliation evidence. Until then capability is false for routing.

## BLOCKER-09 — AkkadPag native split capability
Same evidence required as FlevoPay; no assumptions.

## BLOCKER-10 — Split recipient compliance policy detail
Core law is that live recipients must be eligible. Exact required KYC/KYB/contract relationship for a recipient depends on legal/settlement/provider structure and must be frozen before live recipient onboarding GREEN.
