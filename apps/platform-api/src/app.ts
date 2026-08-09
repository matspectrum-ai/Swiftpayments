import Fastify, { type FastifyInstance } from 'fastify';

const SERVICE_NAME = 'platform-api' as const;

type HealthPayload = {
  status: 'ok';
  service: typeof SERVICE_NAME;
  readiness?: 'ready';
};

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get('/health/live', async (): Promise<HealthPayload> => ({
    status: 'ok',
    service: SERVICE_NAME,
  }));

  app.get('/health/ready', async (): Promise<HealthPayload> => ({
    status: 'ok',
    service: SERVICE_NAME,
    readiness: 'ready',
  }));

  app.get('/health', async (): Promise<HealthPayload> => ({
    status: 'ok',
    service: SERVICE_NAME,
    readiness: 'ready',
  }));

  return app;
}
