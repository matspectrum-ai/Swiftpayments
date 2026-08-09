export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

export type LogSink = (entry: LogEntry) => void;

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  child(context: Record<string, unknown>): Logger;
}

export interface CreateLoggerOptions {
  level?: LogLevel;
  sink?: LogSink;
  context?: Record<string, unknown>;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const defaultSink: LogSink = (entry) => {
  const line = `[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.message}`;
  const detail = entry.context === undefined ? '' : ` ${JSON.stringify(entry.context)}`;
  if (entry.level === 'error' || entry.level === 'warn') {
    console.error(line + detail);
  } else {
    console.log(line + detail);
  }
};

export function createLogger(options: CreateLoggerOptions = {}): Logger {
  const threshold = LEVEL_ORDER[options.level ?? 'info'];
  const sink = options.sink ?? defaultSink;
  const baseContext = options.context ?? {};

  const emit = (level: LogLevel, message: string, context?: Record<string, unknown>): void => {
    if (LEVEL_ORDER[level] < threshold) {
      return;
    }
    sink({
      level,
      message,
      context: context === undefined ? baseContext : { ...baseContext, ...context },
      timestamp: new Date().toISOString(),
    });
  };

  const logger: Logger = {
    debug: (message, context) => emit('debug', message, context),
    info: (message, context) => emit('info', message, context),
    warn: (message, context) => emit('warn', message, context),
    error: (message, context) => emit('error', message, context),
    child: (context) =>
      createLogger({
        level: options.level ?? 'info',
        sink,
        context: { ...baseContext, ...context },
      }),
  };

  return logger;
}
