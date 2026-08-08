import { useCallback, useEffect, useState } from 'react';
import { backend, type ChangePage } from '../../api/backend';
import type { ChangeFilters, ChangeRequest } from '../../types';

const empty: ChangePage = { rows: [], inventory: [], total: 0, pageCount: 1, organizationId: '' };

export function useChanges(organizationId: string, filters: ChangeFilters) {
  const [data, setData] = useState<ChangePage>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    try {
      const result = await backend.listChanges(organizationId, filters);
      setData(result);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load change requests');
    } finally {
      setLoading(false);
    }
  }, [filters, organizationId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => void load(true), 25_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const updateLocal = useCallback((id: string, update: (change: ChangeRequest) => ChangeRequest) => {
    setData((current) => ({
      ...current,
      rows: current.rows.map((row) => row.id === id ? update(row) : row),
    }));
  }, []);

  const removeLocal = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      rows: current.rows.filter((row) => row.id !== id),
      inventory: current.inventory.filter((item) => item !== id),
      total: Math.max(0, current.total - 1),
    }));
  }, []);

  return { ...data, loading, error, refresh: () => load(false), updateLocal, removeLocal };
}
