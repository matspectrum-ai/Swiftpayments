import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

function readJson(rel: string): Record<string, unknown> {
  const abs = join(REPO_ROOT, rel);
  if (!existsSync(abs)) {
    throw new Error(`Expected ${rel} to exist, but it does not`);
  }
  return JSON.parse(readFileSync(abs, 'utf8')) as Record<string, unknown>;
}

describe('FND-001 — Bun workspace root', () => {
  const pkg = () => readJson('package.json');

  it('declares Bun as the package manager', () => {
    expect(pkg().packageManager).toMatch(/^bun@/);
  });

  it('is private and defines apps + packages workspaces', () => {
    const p = pkg();
    expect(p.private).toBe(true);
    expect(p.workspaces).toEqual(expect.arrayContaining(['apps/*', 'packages/*']));
  });

  it('defines the root dev/build/test/lint/typecheck/format scripts', () => {
    const p = pkg();
    expect(p.scripts).toMatchObject({
      dev: expect.any(String),
      build: expect.any(String),
      test: expect.any(String),
      lint: expect.any(String),
      typecheck: expect.any(String),
      format: expect.any(String),
      'format:check': expect.any(String),
    });
  });
});

describe('FND-002 — strict TypeScript base', () => {
  it('provides a strict tsconfig.base.json', () => {
    const base = readJson('tsconfig.base.json');
    expect(base.compilerOptions).toMatchObject({
      strict: true,
      noUncheckedIndexedAccess: true,
    });
  });

  it('root tsconfig extends the base', () => {
    const ts = readJson('tsconfig.json');
    expect(ts.extends).toBe('./tsconfig.base.json');
  });
});

describe('FND-003 — Turborepo pipelines', () => {
  it('defines dev/build/test/lint/typecheck tasks', () => {
    const turbo = readJson('turbo.json');
    for (const task of ['dev', 'build', 'test', 'lint', 'typecheck']) {
      expect(turbo.tasks, `missing turbo task: ${task}`).toHaveProperty(task);
    }
  });
});

describe('FND-004 — lint and format gates', () => {
  it('provides an ESLint flat config', () => {
    expect(existsSync(join(REPO_ROOT, 'eslint.config.mjs'))).toBe(true);
  });

  it('provides a Prettier config', () => {
    expect(existsSync(join(REPO_ROOT, '.prettierrc.json'))).toBe(true);
  });
});
