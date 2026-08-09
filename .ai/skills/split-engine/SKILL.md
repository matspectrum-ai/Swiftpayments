# Skill: Split Engine

Use for any change touching split recipients, split rules, PaymentSplitSnapshot, provider-native split, internal-ledger split, split reconciliation or merchant/admin split UX.

## Mandatory reads
1. `AGENTS.md`
2. `docs/SPLIT_ENGINE.md`
3. `docs/FEES_LEDGER_RECONCILIATION.md`
4. `docs/DOMAIN_MODEL.md`
5. `docs/DATA_MODEL.md`
6. `docs/PROVIDER_CONTRACT.md` and `docs/ROUTING.md` when provider execution changes
7. `docs/TEST_STRATEGY.md`

## Workflow
Problem Analysis → update normative spec/ADR if needed → strict contracts → `SPLIT-*` RED evidence → minimum GREEN → refactor → DB/RLS/concurrency/provider conformance → reconciliation/observability → acceptance → commit.

## Non-negotiable checks
- fee != split != provider cost != settlement;
- integer minor/bps only;
- allocation conservation exact;
- snapshot frozen before provider transmission;
- no provider ID in public model;
- no silent split drop/fallback;
- no native split capability without fixture/conformance evidence;
- internal-ledger execution forbidden while custody ADR blocked;
- historical snapshots immutable.
