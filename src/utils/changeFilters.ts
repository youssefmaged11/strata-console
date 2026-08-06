import type { ChangeFilters, ChangeRequest, Risk } from '../types';

const riskOrder: Record<Risk, number> = { critical: 0, high: 1, moderate: 2, low: 3 };

export function filterChanges(changes: ChangeRequest[], filters: ChangeFilters) {
  const search = filters.search.trim().toLowerCase();
  return changes.filter((change) => {
    const searchable = `${change.number} ${change.title} ${change.service} ${change.requestedBy}`.toLowerCase();
    return (!search || searchable.includes(search))
      && (!filters.statuses.length || filters.statuses.includes(change.status))
      && (!filters.risks.length || filters.risks.includes(change.risk))
      && (!filters.ownerId || change.ownerId === filters.ownerId);
  });
}

export function sortChanges(changes: ChangeRequest[], sort: ChangeFilters['sort']) {
  return [...changes].sort((left, right) => {
    if (sort === 'updated-asc') return left.updatedAt - right.updatedAt;
    if (sort === 'risk') return riskOrder[left.risk] - riskOrder[right.risk] || right.updatedAt - left.updatedAt;
    if (sort === 'scheduled') return left.scheduledAt - right.scheduledAt;
    return right.updatedAt - left.updatedAt;
  });
}
