# Observability and Runbooks

## 1. Correlation

Every request gets `correlation_id`. Propagate into:
- logs;
- DB audit context;
- Payment/ProviderAttempt metadata;
- provider HTTP request metadata when supported;
- outbox/queue messages;
- webhook deliveries.

## 2. Core metrics

API:
- request rate/error rate;
- p50/p95/p99 latency;
- 429 rate;
- DB latency.

Payments:
- create attempts;
- pending/paid/expired/failed;
- idempotency replay/conflict;
- reconciliation-required count.

Providers:
- create latency/success/failure by provider;
- definitive vs ambiguous failure;
- webhook auth failure;
- webhook processing latency;
- circuit/health state.

Merchant webhooks:
- delivered/retrying/dead-letter;
- delivery latency;
- endpoint error distribution.

Compliance:
- queue depth/time-to-review without exposing sensitive content in metrics.

## 3. Logs

Provider HTTP request/response logging must be sanitized. Record operation, endpoint class, status, provider, latency, canonical error classification and safe body excerpts/reference.

Provider webhook raw logs are durable/protected with retention controls.

Admin/audit events are queryable separately from high-volume technical logs.

## 4. Dashboard caching

Dashboard endpoints return cached aggregates quickly. Expired/missing cache enqueues recompute using a DB lease/state to prevent concurrent refresh storms.

Cache metadata:
- calculated_at;
- expires_at;
- processing_until/lease owner;
- next_process_at optional.

Do not add dedicated Redis only for this at initial scale.

## 5. Runbook: ambiguous create

1. locate Payment/ProviderAttempt by correlation/idempotency;
2. never create fallback charge;
3. query original provider if supported;
4. reconcile by provider reference/correlation/external id;
5. if found, normalize canonical state/QR safely;
6. if definitively absent, policy may allow explicit operator/system retry with new recorded attempt;
7. audit resolution.

## 6. Runbook: provider webhook stuck

1. inspect provider webhook log/auth result;
2. inspect dedupe/state transition result;
3. correct parser/config only through normal code/spec path;
4. reprocess stored payload through canonical webhook processor;
5. verify outbox/event and merchant delivery.

## 7. Runbook: merchant webhook failure

1. inspect delivery attempts/status codes;
2. do not alter Payment state;
3. redeliver same event via admin operation;
4. keep event identity stable;
5. audit manual redelivery.

## 8. Runbook: provider outage

1. disable/exclude provider from new routing if required;
2. preserve existing payment bindings;
3. do not reroute ambiguous creates;
4. communicate operational status internally;
5. recover and re-enable after health verification.

## 9. Health probes

`/health/live` is process liveness. `/health/ready` checks mandatory dependencies such as Postgres and required boot configuration. Provider availability should not necessarily make the entire API unready if safe routing can continue via another provider.
