import { envInt } from '@swiftpay/config';
import { buildApp } from './app.js';

const port = envInt('PORT', process.env, { default: 8080 });
const host = '0.0.0.0';

const app = buildApp();

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
