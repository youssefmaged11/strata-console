import { describe, expect, it } from 'vitest';
import type { ChangeFilters } from '../src/types';
import { defaultFilters, filtersFromSearch, filtersToSearch } from '../src/utils/filterUrl';

describe('filter URL serialization', () => {
  it('omits default values', () => {
    expect(filtersToSearch(defaultFilters).toString()).toBe('');
  });

  it('round-trips supported filter values', () => {
    const filters: ChangeFilters = { ...defaultFilters, search: 'gateway', statuses: ['scheduled', 'deploying'], risks: ['critical'], ownerId: 'person-2', sort: 'risk', page: 3 };
    expect(filtersFromSearch(filtersToSearch(filters))).toEqual(filters);
  });

  it('clamps invalid pages to one', () => {
    expect(filtersFromSearch(new URLSearchParams('page=-4')).page).toBe(1);
  });

  it('ignores empty list entries', () => {
    const filters = filtersFromSearch(new URLSearchParams('status=scheduled,,deploying&risk=critical,'));
    expect(filters.statuses).toEqual(['scheduled', 'deploying']);
    expect(filters.risks).toEqual(['critical']);
  });

  it('preserves an explicit owner', () => {
    expect(filtersFromSearch(new URLSearchParams('owner=person-7')).ownerId).toBe('person-7');
  });
});
