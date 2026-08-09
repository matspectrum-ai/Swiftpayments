import { describe, expect, it } from 'vitest';
import {
  checkAppWorkspaceDependencies,
  checkPackageFrameworkDependencies,
  checkUndeclaredImports,
  checkWorkspaceBoundaries,
  listWorkspaceDirectories,
  readManifest,
} from './boundary-rules.js';

describe('FND-006 — import boundaries', () => {
  it('the two API deployables exist as separate workspaces', () => {
    for (const app of ['platform-api', 'payment-api']) {
      const manifest = readManifest(`apps/${app}`);
      expect(manifest.name).toBe(`@swiftpay/${app}`);
    }
  });

  it('the two API deployables are registered workspaces', () => {
    const apps = listWorkspaceDirectories('apps');
    expect(apps).toEqual(expect.arrayContaining(['platform-api', 'payment-api']));
  });

  it('shared packages do not depend on web frameworks', () => {
    for (const name of listWorkspaceDirectories('packages')) {
      const rel = `packages/${name}`;
      const violations = checkPackageFrameworkDependencies(rel, readManifest(rel));
      expect(violations, JSON.stringify(violations)).toEqual([]);
    }
  });

  it('no workspace depends on an app workspace', () => {
    for (const kind of ['apps', 'packages'] as const) {
      for (const name of listWorkspaceDirectories(kind)) {
        const rel = `${kind}/${name}`;
        const violations = checkAppWorkspaceDependencies(rel, readManifest(rel));
        expect(violations, JSON.stringify(violations)).toEqual([]);
      }
    }
  });

  it('every @swiftpay/* import is declared in the workspace manifest', () => {
    for (const kind of ['apps', 'packages'] as const) {
      for (const name of listWorkspaceDirectories(kind)) {
        const rel = `${kind}/${name}`;
        const violations = checkUndeclaredImports(rel, readManifest(rel));
        expect(violations, JSON.stringify(violations)).toEqual([]);
      }
    }
  });

  it('enforces the full boundary rule set without violations', () => {
    for (const kind of ['apps', 'packages'] as const) {
      for (const name of listWorkspaceDirectories(kind)) {
        const rel = `${kind}/${name}`;
        const violations = checkWorkspaceBoundaries(rel, readManifest(rel));
        expect(violations, JSON.stringify(violations)).toEqual([]);
      }
    }
  });
});
