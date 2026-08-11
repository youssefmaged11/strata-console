import { useMemo } from 'react';
import type { ChangeFilters, SavedView } from '../../types';
import { usePersistentState } from '../../hooks/usePersistentState';

export function useSavedViews(organizationId: string, ownerId: string) {
  const [allViews, setAllViews] = usePersistentState<SavedView[]>('strata:saved-views', []);
  const views = useMemo(
    () => allViews.filter((view) => view.organizationId === organizationId && view.ownerId === ownerId),
    [allViews, organizationId, ownerId],
  );
  const save = (name: string, filters: ChangeFilters) => {
    setAllViews((current) => [...current, {
      id: crypto.randomUUID(),
      organizationId,
      ownerId,
      name,
      filters,
    }]);
  };
  const remove = (id: string) => setAllViews((current) => current.filter((view) => view.id !== id));
  return { views, save, remove };
}
