import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '../..');
const requiredPackages = [
  'domain',
  'contracts',
  'db',
  'providers',
  'security',
  'observability',
  'config',
  'ui',
  'testkit',
] as const;

function sourceFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root).flatMap((entry) => {
    const full = join(root, entry);
    return statSync(full).isDirectory() ? sourceFiles(full) : /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

describe('FND-006 — architectural package boundaries', () => {
  it('materializes every canonical shared package', () => {
    for (const name of requiredPackages) {
      expect(existsSync(join(repoRoot, 'packages', name)), `missing packages/${name}`).toBe(true);
    }
  });

  it('canonical domain never imports web frameworks, Supabase or provider adapters', () => {
    const domainRoot = join(repoRoot, 'packages/domain/src');
    expect(existsSync(domainRoot), 'FND-006 RED: packages/domain/src is not implemented').toBe(true);

    const forbidden = ['next', 'react', 'fastify', '@supabase/', '@swiftpay/providers'];
    for (const file of sourceFiles(domainRoot)) {
      const content = readFileSync(file, 'utf8');
      for (const token of forbidden) {
        expect(content, `${relative(repoRoot, file)} imports forbidden dependency ${token}`).not.toContain(
          `from '${token}`,
        );
      }
    }
  });
});
