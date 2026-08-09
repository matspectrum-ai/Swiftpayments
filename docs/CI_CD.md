# CI/CD Gates

## Pull request gates

Every PR/merge candidate runs applicable:

```text
format
lint
TypeScript strict typecheck
forbidden dependency/import boundary checks
OpenAPI lint/compatibility checks
unit tests
API/application tests
provider conformance tests
pgTAP/RLS tests
migration validation
build all affected apps
secret scan
dependency/security scan
```

No warnings-as-ignored policy for financial/security test failures.

## Main/release gates

```text
integration suite
Playwright E2E
k6 smoke thresholds
staging migration
staging smoke
manual/controlled production promotion
```

## Migration rules

- forward-only normal flow;
- never modify an already-applied migration;
- destructive schema change requires expand/migrate/contract sequence where data matters;
- production migration is controlled by deployment pipeline, not hidden app startup;
- rollback uses explicit compensating migration/application version strategy.

## Environment promotion

`local → staging → production`.

Commercial environment (`test|live`) is data/domain scope and must not be confused with deployment environment.

## Release evidence

A release record should identify:
- commit SHA;
- migrations;
- public contract version/change;
- provider mapping change if any;
- tests/load thresholds;
- known blockers/feature flags;
- operator rollback/recovery notes.
