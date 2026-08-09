# Skill: Security Review

For any auth, admin, KYC, webhook, file, API key, provider credential or public endpoint change:

- identify assets/trust boundaries;
- enumerate abuse cases;
- verify authentication + authorization independently;
- check tenant isolation;
- check SSRF/replay/injection/mass assignment;
- inspect logs for secret/PII leaks;
- verify revocation behavior;
- require negative tests;
- document residual risk.

Security-critical changes are Class A and require human review.
