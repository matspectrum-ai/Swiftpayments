import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

const PACKAGES = ['config', 'observability', 'ui', 'testkit'];

function readJson(rel: string): Record<string, unknown> {
  const abs = join(REPO_ROOT, rel);
  if (!existsSync(abs)) {
    throw new Error(`Expected ${rel} to exist, but it does not`);
  }
  return JSON.parse(readFileSync(abs, 'utf8')) as Record<string, unknown>;
}

describe('shared packages are scoped workspaces', () => {
  it.each(PACKAGES)('@swiftpay/%s declares build/typecheck scripts', (name) => {
    const pkg = readJson(`packages/${name}/package.json`);
    expect(pkg.name).toBe(`@swiftpay/${name}`);
    expect(pkg.scripts).toMatchObject({
      build: expect.any(String),
      typecheck: expect.any(String),
    });
  });

  it.each(PACKAGES)('@swiftpay/%s tsconfig extends the base config', (name) => {
    const ts = readJson(`packages/${name}/tsconfig.json`);
    expect(ts.extends).toBe('../../tsconfig.base.json');
  });

  it.each(PACKAGES)('@swiftpay/%s exposes a public entrypoint', (name) => {
    expect(existsSync(join(REPO_ROOT, `packages/${name}/src/index.ts`))).toBe(true);
  });
});
