import { describe, expect, it } from 'vitest';
import { createTestLogger } from './logger.js';

describe('createTestLogger', () => {
  it('captures emitted entries in memory', () => {
    const logger = createTestLogger();

    logger.info('hi', { id: '1' });
    logger.error('boom');

    expect(logger.entries).toHaveLength(2);
    expect(logger.entries[0]).toMatchObject({ level: 'info', message: 'hi', context: { id: '1' } });
    expect(logger.entries[1]).toMatchObject({ level: 'error', message: 'boom' });
  });
});
