# Skill: Database / RLS

Read `DATA_MODEL`, `SECURITY_RBAC_RLS`, relevant domain invariants.

Process:
1. write pgTAP/SQL RED tests for constraint/RLS/concurrency;
2. design forward migration;
3. include indexes/uniqueness with business meaning;
4. implement migration;
5. verify fresh DB + migration path;
6. update logical data model if behavior changed.

Never rely on application pre-check for uniqueness-critical financial behavior.
