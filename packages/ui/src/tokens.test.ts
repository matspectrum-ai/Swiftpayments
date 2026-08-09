import { describe, expect, it } from 'vitest';
import { colors, spacing, typography } from './index.js';

describe('design tokens', () => {
  it('defines a brand color scale', () => {
    expect(colors.primary[500]).toBeDefined();
    expect(colors.primary[500]).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('defines a base spacing scale', () => {
    expect(spacing[4]).toBe('1rem');
    expect(spacing[0]).toBe('0px');
  });

  it('defines typography tokens', () => {
    expect(typography.fontSize.md).toBeDefined();
    expect(typography.fontWeight.semibold).toBeDefined();
  });
});
