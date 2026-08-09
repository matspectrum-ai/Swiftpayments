# Skill: Payment Domain

Read `DOMAIN_MODEL`, `STATE_MACHINES`, `API_CONTRACT`, `FEES_LEDGER_RECONCILIATION`.

Check:
- amount integer minor;
- merchant/environment ownership;
- live eligibility;
- idempotency namespace/fingerprint;
- terminal transition monotonicity;
- fee snapshot immutability;
- provider details internal;
- outbox in same transaction;
- duplicate/out-of-order event safety.

Write RED tests for transition and concurrency before implementation.
