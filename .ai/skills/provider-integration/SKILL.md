# Skill: Pix Provider Integration

Read `PROVIDER_CONTRACT`, `ROUTING`, provider mapping doc and fixtures.

Workflow:
1. capture verified external schema/fixtures;
2. create external runtime schemas;
3. implement parser/error extraction tests;
4. implement status mapper tests;
5. implement webhook auth/parser tests;
6. run shared adapter conformance RED;
7. implement HTTP client transport;
8. implement adapter GREEN;
9. test ambiguity/idempotency/reconciliation capability;
10. document provider deltas.

Never guess undocumented fields or blindly retry create.
