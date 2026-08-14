import { describe, expect, it } from 'vitest';
import { approvals } from '../src/data/approvals';
import { changes } from '../src/data/changes';
import { organizations } from '../src/data/organizations';
import { people } from '../src/data/people';

describe('seed data', () => {
  it('contains substantial change history', () => expect(changes.length).toBeGreaterThan(150));
  it('uses unique change ids', () => expect(new Set(changes.map((change) => change.id)).size).toBe(changes.length));
  it('scopes every change to a known organization', () => expect(changes.every((change) => organizations.some((organization) => organization.id === change.organizationId))).toBe(true));
  it('keeps approval progress within requirements', () => expect(changes.every((change) => change.approvalCount <= change.requiredApprovals)).toBe(true));
  it('links approvals to existing changes', () => expect(approvals.every((approval) => changes.some((change) => change.id === approval.changeId))).toBe(true));
  it('gives every person at least one organization', () => expect(people.every((person) => person.organizationIds.length > 0)).toBe(true));
  it('includes all risk levels', () => expect(new Set(changes.map((change) => change.risk)).size).toBe(4));
  it('includes all workflow statuses', () => expect(new Set(changes.map((change) => change.status)).size).toBe(6));
});
