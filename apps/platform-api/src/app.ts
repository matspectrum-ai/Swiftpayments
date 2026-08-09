import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { registerHealthRoutes } from './routes/health.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  registerHealthRoutes(app);

  return app;
}
