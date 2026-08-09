import { ConfigError } from './errors.js';

export interface EnvSource {
  [key: string]: string | undefined;
}

export interface EnvStringOptions {
  default?: string;
}

export interface EnvIntOptions {
  default?: number;
}

export interface EnvBoolOptions {
  default?: boolean;
}

export function envString(
  name: string,
  source: EnvSource = process.env,
  options: EnvStringOptions = {},
): string {
  const value = source[name];
  if (value !== undefined) {
    return value;
  }
  if (options.default !== undefined) {
    return options.default;
  }
  throw new ConfigError(`Missing required environment variable: ${name}`);
}

export function envInt(
  name: string,
  source: EnvSource = process.env,
  options: EnvIntOptions = {},
): number {
  const value = source[name];
  if (value !== undefined) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      throw new ConfigError(`Environment variable ${name} must be an integer, got "${value}"`);
    }
    return parsed;
  }
  if (options.default !== undefined) {
    return options.default;
  }
  throw new ConfigError(`Missing required environment variable: ${name}`);
}

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const FALSE_VALUES = new Set(['false', '0', 'no', 'off']);

export function envBool(
  name: string,
  source: EnvSource = process.env,
  options: EnvBoolOptions = {},
): boolean {
  const value = source[name];
  if (value !== undefined) {
    const normalized = value.trim().toLowerCase();
    if (TRUE_VALUES.has(normalized)) {
      return true;
    }
    if (FALSE_VALUES.has(normalized)) {
      return false;
    }
    throw new ConfigError(`Environment variable ${name} must be a boolean, got "${value}"`);
  }
  if (options.default !== undefined) {
    return options.default;
  }
  throw new ConfigError(`Missing required environment variable: ${name}`);
}
