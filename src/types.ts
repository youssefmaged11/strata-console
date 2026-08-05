export type Organization = {
  id: string;
  name: string;
  slug: string;
  accent: string;
};

export type Role = 'administrator' | 'release-manager' | 'observer';
export type Risk = 'critical' | 'high' | 'moderate' | 'low';
export type ChangeStatus = 'draft' | 'awaiting-approval' | 'scheduled' | 'deploying' | 'completed' | 'rolled-back';

export type Person = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  presence: 'online' | 'away' | 'offline';
  organizationIds: string[];
};

export type ChangeRequest = {
  id: string;
  organizationId: string;
  number: number;
  title: string;
  summary: string;
  service: string;
  environment: 'production' | 'staging' | 'edge';
  status: ChangeStatus;
  risk: Risk;
  ownerId: string | null;
  requestedBy: string;
  scheduledAt: number;
  updatedAt: number;
  tags: string[];
  version: number;
  approvalCount: number;
  requiredApprovals: number;
};

export type Approval = {
  id: string;
  organizationId: string;
  changeId: string;
  changeNumber: number;
  title: string;
  requestedBy: string;
  risk: Risk;
  createdAt: number;
  approved: boolean;
  version: number;
};

export type ActivityEvent = {
  id: string;
  changeId: string;
  kind: 'created' | 'status' | 'approval' | 'owner' | 'comment';
  actor: string;
  message: string;
  createdAt: number;
  clientId?: string;
};

export type ChangeFilters = {
  search: string;
  statuses: ChangeStatus[];
  risks: Risk[];
  ownerId: string;
  sort: 'updated-desc' | 'updated-asc' | 'risk' | 'scheduled';
  page: number;
  pageSize: number;
};

export type SavedView = {
  id: string;
  organizationId: string;
  ownerId: string;
  name: string;
  filters: ChangeFilters;
};
