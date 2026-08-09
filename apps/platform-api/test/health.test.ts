import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('FND-005 — platform-api health contract', () => {
  it('GET /health/live reports process liveness without dependency checks', async () => {
    const app = buildApp();

    const response = await app.inject({ method: 'GET', url: '/health/live' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('GET /health/ready reports readiness when mandatory dependencies are available', async () => {
    const app = buildApp();

    const response = await app.inject({ method: 'GET', url: '/health/ready' });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(Array.isArray(body.checks)).toBe(true);
  });

  it('GET /health returns the operational aggregate', async () => {
    const app = buildApp();

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(['ok', 'degraded', 'down']).toContain(response.json().status);
  });
});
