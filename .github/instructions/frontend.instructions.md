---
applyTo: 'apps/*-web/**,packages/ui/**'
---
# Frontend Rules

- Next.js + React + TypeScript.
- Merchant, admin and checkout are separate authorization/UX surfaces even when sharing UI package.
- No provider/acquirer details in merchant or buyer UI.
- No financial calculations duplicated in browser; backend/domain owns fees and money rules.
- Realtime only prompts refresh/state UX; canonical payment state is re-read.
- KYC private file URLs are temporary and never persisted in public client state longer than necessary.
- Admin UI is function-first and may expose internal provider attempts/raw operational metadata under RBAC.
- Design system remains dark-first, high-signal, restrained and accessible.
