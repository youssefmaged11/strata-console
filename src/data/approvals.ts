import type { Approval } from '../types';
import { changes } from './changes';

export const approvals: Approval[] = changes
  .filter((change) => change.status === 'awaiting-approval')
  .slice(0, 36)
  .map((change, index) => ({
    id: `approval-${index + 1}`,
    organizationId: change.organizationId,
    changeId: change.id,
    changeNumber: change.number,
    title: change.title,
    requestedBy: change.requestedBy,
    risk: change.risk,
    createdAt: change.updatedAt,
    approved: index % 5 === 0,
    version: 1,
  }));
