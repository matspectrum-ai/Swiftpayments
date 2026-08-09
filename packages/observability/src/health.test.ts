import { describe, expect, it } from 'vitest';
import { runHealthChecks } from './health.js';
import type { HealthCheck } from './health.js';

describe('runHealthChecks', () => {
  it('aggregates to ok when all checks pass', async () => {
    const checks: HealthCheck[] = [
      { name: 'db', check: async () => true },
      { name: 'api', check: async () => true },
    ];

    const report = await runHealthChecks(checks);

    expect(report.status).toBe('ok');
    expect(report.checks).toHaveLength(2);
  });

  it('aggregates to degraded when any check is degraded', async () => {
    const checks: HealthCheck[] = [
      { name: 'db', check: async () => true },
      { name: 'slow', check: async () => ({ degraded: true, detail: 'latency' }) },
    ];

    const report = await runHealthChecks(checks);

    expect(report.status).toBe('degraded');
  });

  it('aggregates to down when a check throws', async () => {
    const checks: HealthCheck[] = [
      {
        name: 'db',
        check: async () => {
          throw new Error('connection refused');
        },
      },
    ];

    const report = await runHealthChecks(checks);

    expect(report.status).toBe('down');
    expect(report.checks[0]).toMatchObject({ status: 'down', detail: 'connection refused' });
  });
});
