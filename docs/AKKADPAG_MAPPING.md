# AkkadPag Provider Mapping Gate

AkkadPag is a required P0 provider and a product/API reference.

## Current state

Provider identity is confirmed, but the repository must not invent field-level API behavior that is not verified from current documentation or fixtures.

## Required mapping evidence

Collect before adapter GREEN:

1. base URL/environment model;
2. authentication type/headers/token lifecycle;
3. Pix create path/request;
4. amount units;
5. customer/document fields;
6. external correlation/reference support;
7. create response IDs;
8. copy-paste/QR fields;
9. expiration semantics;
10. query/search endpoint;
11. all payment statuses and aliases;
12. error envelope/codes;
13. webhook route configuration requirements;
14. webhook authentication/signature/IP/token behavior;
15. webhook payload IDs/status nesting;
16. provider idempotency support;
17. external submerchant/account requirement;
18. reconciliation lookup capability after timeout.

## Contract rule

AkkadPag must satisfy the same `PixProvider` conformance suite as FlevoPay. If a provider capability is missing, the adapter declares capability absence; canonical public API does not fork into Akkad-specific behavior.
