# Skill: Operations / Reliability

Read `OBSERVABILITY_RUNBOOKS`, `WEBHOOKS_EVENTS_ASYNC`, `CI_CD`.

For a critical path define:
- health/readiness dependency;
- correlation propagation;
- metrics and failure classes;
- retry policy per operation;
- durable queue/outbox semantics;
- reprocessing path;
- alert/runbook trigger;
- safe degradation.

Do not make the whole API unready solely because one provider is unhealthy when router can safely continue.
