# Webhooks, Events and Async Processing

## 1. Provider webhook ingress

Routes live only on `payment-api`, e.g.:

`POST /v1/internal/providers/{provider}/webhooks/...`

Responsibilities:

1. resolve provider connection candidates;
2. authenticate webhook;
3. persist protected raw audit record;
4. parse provider payload;
5. deduplicate provider event;
6. apply canonical payment transition atomically;
7. write domain event to outbox;
8. return provider-appropriate acknowledgement.

## 2. Authentication

Provider adapter/config declares auth mode. Supported framework modes may include:
- token;
- source IP;
- token + IP;
- HMAC-SHA256;
- custom adapter authentication when documented.

Do not process unauthenticated payload as financial truth.

## 3. Raw audit log

Store:
- provider/connection;
- route/method/query;
- masked headers;
- protected request body;
- IP/user-agent where available;
- correlation id;
- auth result;
- processing result/status;
- timestamps.

Secrets and full credentials are never logged.

## 4. Canonical merchant events

Initial events:
- `payment.created`;
- `payment.paid`;
- `payment.expired`;
- `payment.failed`.

Event envelope:

```json
{
  "id": "evt_...",
  "object": "event",
  "type": "payment.paid",
  "created_at": "...Z",
  "data": { "payment": {} }
}
```

## 5. Transactional outbox

Payment state mutation and outbox event insert occur in the same DB transaction. Queue publication happens after commit.

If queue delivery fails, outbox remains retryable. Never roll back a committed paid payment because merchant notification delivery failed.

## 6. `pgmq` queues

Suggested queues:

```text
swiftpay.payment.reconcile
swiftpay.webhook.deliver
swiftpay.dashboard.refresh
swiftpay.notification.dispatch
swiftpay.provider.health
```

Add queues only when async behavior is durable and justified.

## 7. Merchant webhook signing

Headers:
- `X-Swiftpay-Signature`;
- `X-Swiftpay-Event`;
- `X-Swiftpay-Delivery`;
- `X-Swiftpay-Attempt`;
- `User-Agent: Swiftpay-Webhook/1.0`.

Use HMAC-SHA256 over an explicitly versioned signing input. Exact timestamp/replay-tolerance format must be frozen in executable contract before implementation.

## 8. Delivery semantics

- 2xx = accepted;
- network error/timeout/4xx/5xx = failed according to retry policy;
- retries use bounded backoff + jitter;
- every attempt is persisted;
- repeated delivery keeps same event identity and unique delivery/attempt metadata;
- dead-letter state is visible and redeliverable by admin.

## 9. Reprocessing

Admin/DEV recovery reuses the exact canonical processing service used by original ingress. It must not manually force DB state around normal transition/idempotency checks.

Typical operations:
- reprocess stored provider webhook;
- reconcile ambiguous provider create by query;
- redeliver merchant webhook.

## 10. Realtime

Supabase Realtime may notify checkout/dashboard that data changed. Client then confirms canonical state through API/authorized database read. Realtime loss cannot affect money or payment correctness.
