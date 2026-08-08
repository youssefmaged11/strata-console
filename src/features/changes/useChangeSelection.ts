import { useCallback, useEffect, useState } from 'react';

export function useChangeSelection(visibleIds: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected((current) => {
      const kept = [...current].filter((id) => visibleIds.includes(id));
      return kept.length === current.size ? current : new Set(kept);
    });
  }, [visibleIds]);

  const toggle = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const togglePage = useCallback(() => {
    setSelected((current) => {
      const next = new Set(current);
      const allSelected = visibleIds.every((id) => next.has(id));
      visibleIds.forEach((id) => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  }, [visibleIds]);

  const clear = useCallback(() => setSelected(new Set()), []);
  return { selected, selectedIds: [...selected], toggle, togglePage, clear };
}
