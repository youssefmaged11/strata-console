import { useCallback, useRef } from 'react';
import { backend } from '../../api/backend';
import { useToast } from '../../components/ToastProvider';
import type { ChangeRequest, Risk } from '../../types';

type MutableFields = Pick<ChangeRequest, 'ownerId' | 'risk' | 'status'>;

export function useChangeMutations(
  updateLocal: (id: string, update: (change: ChangeRequest) => ChangeRequest) => void,
  removeLocal: (id: string) => void,
) {
  const { push } = useToast();
  const operation = useRef(0);
  const lastUndo = useRef<(() => void) | null>(null);

  const mutate = useCallback(async (id: string, patch: Partial<MutableFields>) => {
    const operationId = `operation-${++operation.current}`;
    let previous: ChangeRequest | undefined;
    updateLocal(id, (current) => {
      previous = current;
      return { ...current, ...patch, updatedAt: Date.now() };
    });
    try {
      const saved = await backend.updateChange(id, patch, operationId);
      updateLocal(id, () => saved);
      lastUndo.current = () => previous && void mutate(id, {
        ownerId: previous.ownerId,
        risk: previous.risk,
        status: previous.status,
      });
      push({
        tone: 'success',
        message: 'Change request updated',
        action: { label: 'Undo', onClick: () => lastUndo.current?.() },
      });
      return saved;
    } catch (reason) {
      if (previous) updateLocal(id, () => previous!);
      push({ tone: 'danger', message: reason instanceof Error ? reason.message : 'Update failed' });
      throw reason;
    }
  }, [push, updateLocal]);

  const bulkRisk = useCallback(async (ids: string[], risk: Risk) => {
    const previous = new Map<string, ChangeRequest>();
    ids.forEach((id) => updateLocal(id, (current) => {
      previous.set(id, current);
      return { ...current, risk, updatedAt: Date.now() };
    }));
    const results = await backend.bulkRisk(ids, risk);
    results.forEach((result) => {
      if (result.ok) updateLocal(result.id, () => result.change);
      else {
        const prior = previous.get(result.id);
        if (prior) updateLocal(result.id, () => prior);
      }
    });
    const failed = results.filter((result) => !result.ok).length;
    push({
      tone: failed ? 'info' : 'success',
      message: failed ? `${ids.length - failed} updated, ${failed} failed` : `${ids.length} changes updated`,
    });
  }, [push, updateLocal]);

  const deleteChange = useCallback(async (id: string) => {
    await backend.deleteChange(id);
    removeLocal(id);
    push({ tone: 'success', message: 'Change request deleted' });
  }, [push, removeLocal]);

  return { mutate, bulkRisk, deleteChange };
}
