# Checkout, Orders and Payment Links

## 1. Order vs Payment
API direct: `POST /v1/payments → Payment`. Hosted flow: `buyer confirms → Order snapshot → Payment`.

## 2. Product
Small Pix product: name, description, price minor, active, optional image, merchant ownership. Product may reference an active SplitRule for future child Payments; changing product split config never mutates historical snapshots.

## 3. Checkout
Checkout owns presentation/config/products and may specify/override a SplitRule according to merchant policy. Price remains sourced from product truth; split config is resolved only when Payment is created.

Lifecycle `draft → active → disabled`.

## 4. Payment Link
Creating link persists config only; no Payment. Link may carry `split_rule_id`. At buyer confirm:

`validate link/session → create Order snapshot → resolve fee → resolve/freeze split snapshot → create Payment/provider flow → canonical Pix`.

## 5. Unlimited links
Reusable until disabled. Each buyer/session tracks own Payment. A later rule version applies only to later Payments; prior child snapshots remain unchanged.

## 6. Split precedence

To prevent hidden ambiguity, one effective split source is resolved by explicit precedence and stored in Payment intent. v0.x default precedence:

1. PaymentLink explicit split rule, when flow originates from link;
2. Checkout explicit split rule;
3. Product split rule when a single unambiguous product rule applies;
4. no split.

Conflicting multi-product rules cannot be guessed; checkout config must select one explicit rule before activation or Payment creation fails validation.

## 7. Buyer privacy
Buyer does not receive internal recipient/provider identities unless product UX explicitly exposes merchant-safe beneficiary presentation. Provider IDs never leak.

## 8. Pix UX
Amount, copy-paste, QR, expiry and pending/paid/expired/failed. Realtime triggers refresh; API is truth.

## 9. KPIs/environment
KPIs may include sessions/orders/payments/paid/revenue/conversion. Split accounting KPIs are merchant/admin finance read models, not buyer checkout computation. Test/live configs are isolated; promotion copies config into new live draft and resolves live-eligible split rules/recipients explicitly.
