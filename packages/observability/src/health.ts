export type HealthStatus = 'ok' | 'degraded' | 'down';

export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  detail?: string;
}

export interface HealthCheck {
  name: string;
  check: () => Promise<boolean | { degraded?: boolean; detail?: string }>;
}

export interface HealthReport {
  status: HealthStatus;
  checks: HealthCheckResult[];
}

function toResult(name: string, check: HealthCheck['check']): Promise<HealthCheckResult> {
  return Promise.resolve()
    .then(check)
    .then((outcome) => {
      if (typeof outcome === 'object' && outcome !== null && outcome.degraded === true) {
        return { name, status: 'degraded' as const, detail: outcome.detail };
      }
      return { name, status: 'ok' as const };
    })
    .catch((error: unknown) => ({
      name,
      status: 'down' as const,
      detail: error instanceof Error ? error.message : String(error),
    }));
}

export async function runHealthChecks(checks: readonly HealthCheck[]): Promise<HealthReport> {
  const results = await Promise.all(checks.map(({ name, check }) => toResult(name, check)));

  const status: HealthStatus = results.some((r) => r.status === 'down')
    ? 'down'
    : results.some((r) => r.status === 'degraded')
      ? 'degraded'
      : 'ok';

  return { status, checks: results };
}
