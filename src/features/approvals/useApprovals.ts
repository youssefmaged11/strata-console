import { useCallback, useEffect, useState } from 'react';
import { backend } from '../../api/backend';
import { useToast } from '../../components/ToastProvider';
import type { Approval } from '../../types';

export function useApprovals(organizationId: string) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  const load = useCallback(async () => {
    const result = await backend.listApprovals(organizationId);
    setApprovals(result);
    setLoading(false);
  }, [organizationId]);
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 20_000);
    return () => window.clearInterval(timer);
  }, [load]);
  const approve = useCallback(async (id: string) => {
    let previous: Approval | undefined;
    setApprovals((current) => current.map((approval) => {
      if (approval.id !== id) return approval;
      previous = approval;
      return { ...approval, approved: true };
    }));
    try {
      const saved = await backend.approve(id, `approval-${Date.now()}`);
      setApprovals((current) => current.map((approval) => approval.id === id ? saved : approval));
      push({ tone: 'success', message: 'Approval recorded' });
    } catch (reason) {
      if (previous) setApprovals((current) => current.map((approval) => approval.id === id ? previous! : approval));
      push({ tone: 'danger', message: reason instanceof Error ? reason.message : 'Approval failed' });
    }
  }, [push]);
  return { approvals, loading, approve, refresh: load };
}
