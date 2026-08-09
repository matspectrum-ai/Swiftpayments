import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

export const APP_WORKSPACES = [
  '@swiftpay/platform-api',
  '@swiftpay/payment-api',
  '@swiftpay/merchant-web',
  '@swiftpay/admin-web',
  '@swiftpay/checkout-web',
];

export interface DependencyViolation {
  workspace: string;
  message: string;
}

export interface WorkspaceManifest {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/** Canonical domain packages must not depend on web frameworks (REPOSITORY_STRUCTURE.md). */
const PACKAGE_FORBIDDEN_DEPENDENCIES = [
  'fastify',
  'next',
  '@supabase/supabase-js',
  '@supabase/ssr',
];

const SWIFTPAY_IMPORT = /from\s+['"]@swiftpay\/([a-z0-9-]+)['"]/g;

export function readManifest(rel: string): WorkspaceManifest {
  const abs = join(REPO_ROOT, rel, 'package.json');
  if (!existsSync(abs)) {
    throw new Error(`Expected ${rel}/package.json to exist, but it does not`);
  }
  return JSON.parse(readFileSync(abs, 'utf8')) as WorkspaceManifest;
}

export function listWorkspaceDirectories(kind: 'apps' | 'packages'): string[] {
  const abs = join(REPO_ROOT, kind);
  if (!existsSync(abs)) {
    return [];
  }
  return readdirSync(abs, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function collectSourceFiles(dir: string): string[] {
  const abs = join(REPO_ROOT, dir);
  if (!existsSync(abs)) {
    return [];
  }
  const files: string[] = [];
  const walk = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.ts')) {
        files.push(full);
      }
    }
  };
  walk(abs);
  return files;
}

/** A shared package must not depend on web framework packages. */
export function checkPackageFrameworkDependencies(
  rel: string,
  manifest: WorkspaceManifest,
): DependencyViolation[] {
  const violations: DependencyViolation[] = [];
  const dependencies = manifest.dependencies ?? {};
  for (const forbidden of PACKAGE_FORBIDDEN_DEPENDENCIES) {
    if (dependencies[forbidden] !== undefined) {
      violations.push({
        workspace: rel,
        message: `shared package must not depend on ${forbidden}`,
      });
    }
  }
  return violations;
}

/** No workspace (package or app) may depend on an app workspace (apps are never reversed into). */
export function checkAppWorkspaceDependencies(
  rel: string,
  manifest: WorkspaceManifest,
): DependencyViolation[] {
  const violations: DependencyViolation[] = [];
  const allDependencies = { ...(manifest.dependencies ?? {}), ...(manifest.devDependencies ?? {}) };
  for (const app of APP_WORKSPACES) {
    if (allDependencies[app] !== undefined) {
      violations.push({
        workspace: rel,
        message: `workspace must not depend on app workspace ${app}`,
      });
    }
  }
  return violations;
}

/** Any @swiftpay/* import in source must be declared in the workspace manifest. */
export function checkUndeclaredImports(
  rel: string,
  manifest: WorkspaceManifest,
): DependencyViolation[] {
  const violations: DependencyViolation[] = [];
  const declared = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
  ]);
  for (const file of collectSourceFiles(join(rel, 'src'))) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(SWIFTPAY_IMPORT)) {
      const target = match[1];
      if (target !== undefined && !declared.has(`@swiftpay/${target}`)) {
        violations.push({
          workspace: rel,
          message: `${file} imports @swiftpay/${target} without declaring it`,
        });
      }
    }
  }
  return violations;
}

export function checkWorkspaceBoundaries(
  rel: string,
  manifest: WorkspaceManifest,
): DependencyViolation[] {
  const isPackage = rel.startsWith('packages/');
  return [
    ...(isPackage ? checkPackageFrameworkDependencies(rel, manifest) : []),
    ...checkAppWorkspaceDependencies(rel, manifest),
    ...checkUndeclaredImports(rel, manifest),
  ];
}
