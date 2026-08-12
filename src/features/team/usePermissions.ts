import { useCallback } from 'react';
import { useSession } from '../../app/SessionProvider';
import type { Role } from '../../types';

export type Permission = 'team:edit' | 'changes:delete' | 'approvals:grant';

const grants: Record<Role, Permission[]> = {
  administrator: ['team:edit', 'changes:delete', 'approvals:grant'],
  'release-manager': ['approvals:grant'],
  observer: [],
};

export function usePermissions() {
  const { user } = useSession();
  return useCallback((permission: Permission) => grants[user.role].includes(permission), [user.role]);
}
