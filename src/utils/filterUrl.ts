import type { ChangeFilters } from '../types';

export const defaultFilters: ChangeFilters = {
  search: '',
  statuses: [],
  risks: [],
  ownerId: '',
  sort: 'updated-desc',
  page: 1,
  pageSize: 15,
};

export function filtersFromSearch(params: URLSearchParams): ChangeFilters {
  return {
    ...defaultFilters,
    search: params.get('q') ?? '',
    statuses: (params.get('status')?.split(',').filter(Boolean) ?? []) as ChangeFilters['statuses'],
    risks: (params.get('risk')?.split(',').filter(Boolean) ?? []) as ChangeFilters['risks'],
    ownerId: params.get('owner') ?? '',
    sort: (params.get('sort') as ChangeFilters['sort']) ?? defaultFilters.sort,
    page: Math.max(1, Number(params.get('page') || 1)),
  };
}

export function filtersToSearch(filters: ChangeFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set('q', filters.search);
  if (filters.statuses.length) params.set('status', filters.statuses.join(','));
  if (filters.risks.length) params.set('risk', filters.risks.join(','));
  if (filters.ownerId) params.set('owner', filters.ownerId);
  if (filters.sort !== defaultFilters.sort) params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', String(filters.page));
  return params;
}
