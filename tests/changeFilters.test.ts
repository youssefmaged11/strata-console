import { describe, expect, it } from 'vitest';
import { changes } from '../src/data/changes';
import { defaultFilters } from '../src/utils/filterUrl';
import { filterChanges, sortChanges } from '../src/utils/changeFilters';

describe('change filtering', () => {
  it('returns all changes for empty filters', () => {
    expect(filterChanges(changes, defaultFilters)).toHaveLength(changes.length);
  });

  it.each([
    ['title', changes[0].title.split(' ')[0]],
    ['number', String(changes[1].number)],
    ['service', changes[2].service],
    ['requester', changes[3].requestedBy],
  ])('searches by %s', (_field, query) => {
    const result = filterChanges(changes, { ...defaultFilters, search: query });
    expect(result.length).toBeGreaterThan(0);
  });

  it('matches search case-insensitively', () => {
    const result = filterChanges(changes, { ...defaultFilters, search: changes[0].title.toUpperCase() });
    expect(result.some((change) => change.id === changes[0].id)).toBe(true);
  });

  it('combines status and risk filters', () => {
    const target = changes[12];
    const result = filterChanges(changes, { ...defaultFilters, statuses: [target.status], risks: [target.risk] });
    expect(result.every((change) => change.status === target.status && change.risk === target.risk)).toBe(true);
  });

  it('filters by owner', () => {
    const result = filterChanges(changes, { ...defaultFilters, ownerId: 'person-2' });
    expect(result.every((change) => change.ownerId === 'person-2')).toBe(true);
  });
});

describe('change sorting', () => {
  it('sorts newest updates first', () => {
    const result = sortChanges(changes, 'updated-desc');
    expect(result[0].updatedAt).toBeGreaterThanOrEqual(result[1].updatedAt);
  });

  it('sorts oldest updates first', () => {
    const result = sortChanges(changes, 'updated-asc');
    expect(result[0].updatedAt).toBeLessThanOrEqual(result[1].updatedAt);
  });

  it('sorts critical risk before lower risks', () => {
    const result = sortChanges(changes, 'risk');
    expect(result[0].risk).toBe('critical');
  });

  it('sorts by scheduled time', () => {
    const result = sortChanges(changes, 'scheduled');
    expect(result[0].scheduledAt).toBeLessThanOrEqual(result.at(-1)!.scheduledAt);
  });

  it('does not mutate the source array', () => {
    const copy = [...changes];
    sortChanges(changes, 'scheduled');
    expect(changes).toEqual(copy);
  });
});
