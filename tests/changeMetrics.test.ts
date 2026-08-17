import { describe, expect, it } from 'vitest';
import { changes } from '../src/data/changes';
import { summarizeChanges } from '../src/utils/changeMetrics';

describe('change portfolio metrics', () => {
  it('counts active changes without completed or rolled-back work', () => {
    const metrics = summarizeChanges(changes);
    const expected = changes.filter((change) => !['completed', 'rolled-back'].includes(change.status)).length;
    expect(metrics.active).toBe(expected);
  });

  it('counts critical-risk changes', () => {
    expect(summarizeChanges(changes).critical).toBe(changes.filter((change) => change.risk === 'critical').length);
  });

  it('counts production changes', () => {
    expect(summarizeChanges(changes).production).toBe(changes.filter((change) => change.environment === 'production').length);
  });

  it('counts changes waiting for approval', () => {
    expect(summarizeChanges(changes).awaitingApproval).toBe(changes.filter((change) => change.status === 'awaiting-approval').length);
  });

  it('returns zeroes for an empty portfolio', () => {
    expect(summarizeChanges([])).toEqual({ active: 0, critical: 0, production: 0, awaitingApproval: 0, approvalReady: 0 });
  });
});
