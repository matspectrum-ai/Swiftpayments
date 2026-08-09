import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

describe('FND-008 — CI quality gates', () => {
  it('provides a GitHub Actions workflow', () => {
    const workflowPath = join(REPO_ROOT, '.github/workflows/ci.yml');
    expect(existsSync(workflowPath)).toBe(true);
  });

  it('workflow runs format, lint, typecheck, test, build and secret scan', () => {
    const content = readFileSync(join(REPO_ROOT, '.github/workflows/ci.yml'), 'utf8');

    for (const gate of ['format:check', 'lint', 'typecheck', 'test', 'build']) {
      expect(content, `workflow must run ${gate}`).toContain(gate);
    }
    expect(content).toMatch(/gitleaks|secret/i);
  });
});
