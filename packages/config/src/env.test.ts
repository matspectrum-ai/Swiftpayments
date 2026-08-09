import { describe, expect, it } from 'vitest';
import { envBool, envInt, envString } from './env.js';

describe('envString', () => {
  it('returns the value when present', () => {
    expect(envString('FOO', { FOO: 'bar' })).toBe('bar');
  });

  it('returns the default when missing', () => {
    expect(envString('MISSING', {}, { default: 'fallback' })).toBe('fallback');
  });

  it('throws when required and missing without default', () => {
    expect(() => envString('MISSING', {})).toThrow(/MISSING/);
  });
});

describe('envInt', () => {
  it('parses integer values', () => {
    expect(envInt('PORT', { PORT: '8080' })).toBe(8080);
  });

  it('rejects non-integer values', () => {
    expect(() => envInt('PORT', { PORT: 'abc' })).toThrow(/PORT/);
  });

  it('returns the default when missing', () => {
    expect(envInt('PORT', {}, { default: 3000 })).toBe(3000);
  });
});

describe('envBool', () => {
  it('parses true/false variants', () => {
    expect(envBool('FLAG', { FLAG: 'true' })).toBe(true);
    expect(envBool('FLAG', { FLAG: '1' })).toBe(true);
    expect(envBool('FLAG', { FLAG: 'false' })).toBe(false);
    expect(envBool('FLAG', { FLAG: '0' })).toBe(false);
  });

  it('rejects invalid boolean values', () => {
    expect(() => envBool('FLAG', { FLAG: 'maybe' })).toThrow(/FLAG/);
  });
});
