import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

describe('FND-007 — Supabase local foundation', () => {
  it('provides a local config.toml with a project id', () => {
    const configPath = join(REPO_ROOT, 'supabase/config.toml');
    expect(existsSync(configPath)).toBe(true);

    const content = readFileSync(configPath, 'utf8');
    expect(content).toMatch(/project_id\s*=/);
  });

  it('provides migrations that enable pgmq and pg_cron', () => {
    const migrationsDir = join(REPO_ROOT, 'supabase/migrations');
    expect(existsSync(migrationsDir)).toBe(true);

    const migrations = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'));
    expect(migrations.length).toBeGreaterThan(0);

    const content = migrations
      .map((file) => readFileSync(join(migrationsDir, file), 'utf8'))
      .join('\n');
    expect(content).toMatch(/pgmq/i);
    expect(content).toMatch(/pg_cron/i);
  });

  it('provides a pgTAP test for the extensions', () => {
    expect(existsSync(join(REPO_ROOT, 'supabase/tests/0001_extensions_test.sql'))).toBe(true);
  });
});
