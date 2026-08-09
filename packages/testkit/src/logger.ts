export interface TestLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
}

export interface TestLogger {
  entries: TestLogEntry[];
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export function createTestLogger(): TestLogger {
  const entries: TestLogEntry[] = [];

  const emit =
    (level: TestLogEntry['level']) =>
    (message: string, context?: Record<string, unknown>): void => {
      entries.push({ level, message, context });
    };

  return {
    entries,
    debug: emit('debug'),
    info: emit('info'),
    warn: emit('warn'),
    error: emit('error'),
  };
}
