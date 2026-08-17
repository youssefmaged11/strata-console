import type { ChangeRequest } from '../types';

export type ChangeMetrics = {
  active: number;
  critical: number;
  production: number;
  awaitingApproval: number;
  approvalReady: number;
};

export function summarizeChanges(changes: ChangeRequest[]): ChangeMetrics {
  return changes.reduce<ChangeMetrics>((summary, change) => {
    if (!['completed', 'rolled-back'].includes(change.status)) summary.active += 1;
    if (change.risk === 'critical') summary.critical += 1;
    if (change.environment === 'production') summary.production += 1;
    if (change.status === 'awaiting-approval') summary.awaitingApproval += 1;
    if (change.approvalCount >= change.requiredApprovals) summary.approvalReady += 1;
    return summary;
  }, { active: 0, critical: 0, production: 0, awaitingApproval: 0, approvalReady: 0 });
}
