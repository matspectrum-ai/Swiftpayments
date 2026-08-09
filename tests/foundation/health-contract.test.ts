import { access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '../..');

async function loadBuildApp(app: 'platform-api' | 'payment-api') {
  const modulePath = resolve(repoRoot, `apps/${app}/src/app.ts`);

  try {
    await access(modulePath);
  } catch {
    throw new Error(`FND-005 RED: ${app} application shell is not implemented yet`);
  }

  const module = (await import(pathToFileURL(modulePath).href)) as {
    buildApp?: () => Promise<{
      inject(input: { method: string; url: string }): Promise<{ statusCode: number; json(): unknown }>;
      close(): Promise<void>;
    }>;
  };

  if (!module.buildApp) {
    throw new Error(`FND-005 RED: ${app} does not export buildApp()`);
  }

  return module.buildApp();
}

for (const appName of ['platform-api', 'payment-api'] as const) {
  describe(`FND-005 — ${appName} health contract`, () => {
    for (const path of ['/health/live', '/health/ready', '/health'] as const) {
      it(`GET ${path} returns 200 with service identity`, async () => {
        const app = await loadBuildApp(appName);
        const response = await app.inject({ method: 'GET', url: path });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject({
          status: 'ok',
          service: appName,
        });

        await app.close();
      });
    }
  });
}
