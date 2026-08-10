import { useCallback, useEffect, useState } from 'react';
import { backend } from '../../api/backend';
import type { ActivityEvent } from '../../types';

export function useActivity(changeId: string) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (append = false) => {
    setLoading(true);
    const result = await backend.activity(changeId);
    setEvents((current) => append ? [...result, ...current] : result);
    setLoading(false);
  }, [changeId]);

  useEffect(() => { void load(false); }, [load]);

  const addComment = useCallback(async (message: string) => {
    const clientId = crypto.randomUUID();
    const optimistic: ActivityEvent = {
      id: `optimistic-${clientId}`,
      clientId,
      changeId,
      kind: 'comment',
      actor: 'Youssef Maged',
      message,
      createdAt: Date.now(),
    };
    setEvents((current) => [optimistic, ...current]);
    const saved = await backend.comment(changeId, message, clientId);
    setEvents((current) => [saved, ...current]);
  }, [changeId]);

  return { events, loading, addComment, refresh: () => load(true) };
}
