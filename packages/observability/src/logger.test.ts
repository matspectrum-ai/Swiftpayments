import { describe, expect, it } from 'vitest';
import { createLogger } from './logger.js';
import type { LogEntry } from './logger.js';

describe('createLogger', () => {
  it('writes structured entries to the sink', () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ sink: (entry) => entries.push(entry) });

    logger.info('hello', { id: '1' });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      level: 'info',
      message: 'hello',
      context: { id: '1' },
    });
  });

  it('filters entries below the configured level', () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: 'warn', sink: (entry) => entries.push(entry) });

    logger.debug('hidden');
    logger.warn('shown');

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ level: 'warn', message: 'shown' });
  });

  it('child loggers merge base context', () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ sink: (entry) => entries.push(entry) });
    const child = logger.child({ requestId: 'r1' });

    child.info('done');

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ context: { requestId: 'r1' } });
  });
});
