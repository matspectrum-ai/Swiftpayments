# Skill: KYC / Compliance

Read `KYC_COMPLIANCE_ADMIN` and `SECURITY_RBAC_RLS`.

Treat KYC as workflow/history, not boolean.

Before implementation define:
- subject PF/PJ;
- required fields/evidence;
- allowed review transitions;
- reviewer roles;
- needs-info field keys;
- live gate impact;
- storage/access/retention;
- provider submerchant effects.

Tests must cover self-approval denial, unauthorized reviewer, private document access, approval audit and suspension live-block.
