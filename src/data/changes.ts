import type { ChangeRequest } from '../types';

const titles = [
  'Rotate checkout signing keys',
  'Increase settlement worker concurrency',
  'Enable regional failover policy',
  'Upgrade identity gateway runtime',
  'Migrate invoice storage index',
  'Roll out adaptive rate limiting',
  'Replace webhook delivery queue',
  'Update customer export pipeline',
  'Shift traffic to edge cluster',
  'Rebuild search suggestion cache',
  'Introduce database connection proxy',
  'Retire legacy audit stream',
];

const services = ['Checkout API', 'Ledger', 'Identity', 'Notifications', 'Exports', 'Search', 'Data Platform', 'Edge Gateway'];
const summaries = [
  'Coordinated production change with a staged rollout, automated health gates, and a documented rollback path.',
  'Customer-impacting infrastructure update scheduled inside the regional maintenance window.',
  'Application release that requires service-owner approval and continuous error-budget monitoring.',
];
const statuses: ChangeRequest['status'][] = ['draft', 'awaiting-approval', 'scheduled', 'deploying', 'completed', 'rolled-back'];
const risks: ChangeRequest['risk'][] = ['critical', 'high', 'moderate', 'low'];
const environments: ChangeRequest['environment'][] = ['production', 'staging', 'edge'];
const organizationIds = ['org-aurora', 'org-kestrel', 'org-nimbus'];

export const changes: ChangeRequest[] = Array.from({ length: 198 }, (_, index) => {
  const organizationId = organizationIds[index % organizationIds.length];
  const status = statuses[(index * 5 + 1) % statuses.length];
  const requiredApprovals = index % 7 === 0 ? 3 : 2;
  return {
    id: `change-${index + 1}`,
    organizationId,
    number: 7200 + index,
    title: titles[index % titles.length],
    summary: summaries[index % summaries.length],
    service: services[(index * 3) % services.length],
    environment: environments[index % environments.length],
    status,
    risk: risks[(index * 7) % risks.length],
    ownerId: index % 10 === 0 ? null : `person-${(index % 7) + 1}`,
    requestedBy: ['Maya Chen', 'Noah Williams', 'Priya Raman', 'Elias Moreau'][index % 4],
    scheduledAt: Date.UTC(2026, 7, 18, 8, 0) + index * 45 * 60_000,
    updatedAt: Date.UTC(2026, 7, 17, 15, 0) - index * 23 * 60_000,
    tags: [['payments', 'pci'], ['identity', 'security'], ['data', 'migration'], ['edge', 'traffic']][index % 4],
    version: 1,
    approvalCount: status === 'awaiting-approval' ? index % requiredApprovals : requiredApprovals,
    requiredApprovals,
  };
});
