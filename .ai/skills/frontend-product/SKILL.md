# Skill: Frontend / Product Surface

Read PRD, relevant domain/API spec and frontend instructions.

Merchant UX hides provider internals. Admin UX may expose operational internals under RBAC. Buyer checkout stays minimal and Pix-specific.

Never calculate authoritative fees/payment status in browser. Realtime is hint; re-read canonical state.

For every flow include loading, empty, validation, permission, failure, retry/recovery and mobile behavior.
