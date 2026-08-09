import type { FastifyInstance } from 'fastify';
import { runHealthChecks } from '@swiftpay/observability';
import type { HealthCheck } from '@swiftpay/observability';

const READINESS_CHECKS: HealthCheck[] = [];

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get('/health/live', async () => ({ status: 'ok' }));

  app.get('/health/ready', async () => {
    const report = await runHealthChecks(READINESS_CHECKS);
    return report;
  });

  app.get('/health', async () => {
    const report = await runHealthChecks(READINESS_CHECKS);
    return report;
  });
}
