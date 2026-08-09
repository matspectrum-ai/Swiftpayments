# Checkout, Orders and Payment Links

## 1. Order vs Payment

Order is commerce; Payment is financial Pix state.

### API direct

`POST /v1/payments → Payment` only.

### Hosted checkout

`buyer confirms → Order snapshot → Payment`.

## 2. Product

P0 product is deliberately small:
- name;
- description;
- price minor;
- active;
- optional public images;
- merchant ownership.

No card/boleto options. Avoid inventory/variant complexity unless product scope explicitly requires it.

## 3. Checkout

Checkout owns presentation/configuration and selected products. Product price is sourced from product/variant truth; checkout must not silently invent a conflicting custom price.

Lifecycle:

`draft → active → disabled`.

Active requires minimum valid configuration and at least one active sellable product/config path.

## 4. Payment Link

Creating a link persists configuration only.

It must **not** create Payment.

Public start:

```text
GET link config
→ buyer/session fills required data
→ POST start/confirm
→ create Order snapshot
→ create Payment via same Payment application service
→ return canonical Pix
```

## 5. Unlimited links

When link has no lifetime expiry:
- token remains reusable until disabled;
- one child terminal Payment does not end link;
- each buyer/session must track its own payment id;
- new session must not accidentally expose/reuse another buyer's Pix;
- active-payment reuse is allowed only by explicit session/idempotency semantics, never global token state.

## 6. Buyer privacy

Public payment link/checkout responses expose only necessary merchant branding/commerce data explicitly approved for buyer view. Internal merchant/provider identifiers are not leaked.

## 7. Pix UX

Checkout shows:
- amount;
- customer summary where appropriate;
- copy-and-paste Pix;
- QR image derived/rendered safely from canonical payload;
- expiry;
- pending/paid/expired/failed state.

Realtime signal can trigger refresh; API remains truth.

## 8. KPIs

Useful checkout KPIs:
- access/session count;
- order count;
- payment count;
- paid count;
- approval/conversion rate;
- paid revenue;
- unique customer count when privacy model permits.

Compute asynchronously/cached when volume makes synchronous aggregation expensive.

## 9. Environment

Test and live checkout/link configs are separate resources or explicitly environment-scoped. Promotion copies configuration into a new live draft; it does not magically reuse test Payment state.
