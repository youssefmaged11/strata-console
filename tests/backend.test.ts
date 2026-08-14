import { describe, expect, it } from 'vitest';
import { backend } from '../src/api/backend';
import { scheduler } from '../src/api/scheduler';
import { defaultFilters } from '../src/utils/filterUrl';

describe('in-memory backend', () => {
  it.each(['org-aurora', 'org-kestrel', 'org-nimbus'])('scopes change requests to %s', async (organizationId) => {
    const page = await backend.listChanges(organizationId, defaultFilters);
    expect(page.rows.every((change) => change.organizationId === organizationId)).toBe(true);
  });

  it('returns an authoritative organization inventory', async () => {
    const page = await backend.listChanges('org-aurora', defaultFilters);
    expect(page.inventory.length).toBeGreaterThan(page.rows.length);
    expect(page.inventory.every((id) => id.startsWith('change-'))).toBe(true);
  });

  it('paginates filtered results', async () => {
    const first = await backend.listChanges('org-aurora', { ...defaultFilters, pageSize: 5 });
    const second = await backend.listChanges('org-aurora', { ...defaultFilters, pageSize: 5, page: 2 });
    expect(first.rows).toHaveLength(5);
    expect(second.rows[0].id).not.toBe(first.rows[0].id);
  });

  it('loads change details by id', async () => {
    const page = await backend.listChanges('org-aurora', defaultFilters);
    expect((await backend.getChange(page.rows[0].id)).id).toBe(page.rows[0].id);
  });

  it('updates mutable change fields and version', async () => {
    const page = await backend.listChanges('org-aurora', defaultFilters);
    const before = page.rows[0];
    const saved = await backend.updateChange(before.id, { risk: 'low' }, 'test-update');
    expect(saved.risk).toBe('low');
    expect(saved.version).toBe(before.version + 1);
  });

  it('reports deterministic partial bulk failures', async () => {
    const page = await backend.listChanges('org-aurora', { ...defaultFilters, pageSize: 8 });
    const result = await backend.bulkRisk(page.rows.map((row) => row.id), 'high');
    expect(result.some((item) => !item.ok)).toBe(true);
    expect(result.some((item) => item.ok)).toBe(true);
  });

  it('deletes a change from inventory', async () => {
    const page = await backend.listChanges('org-aurora', defaultFilters);
    await backend.deleteChange(page.rows[0].id);
    const after = await backend.listChanges('org-aurora', defaultFilters);
    expect(after.inventory).not.toContain(page.rows[0].id);
  });

  it('records approvals', async () => {
    const approvals = await backend.listApprovals('org-aurora');
    const pending = approvals.find((approval) => !approval.approved)!;
    expect((await backend.approve(pending.id, 'test-approval')).approved).toBe(true);
  });

  it('adds comments with client identity', async () => {
    const page = await backend.listChanges('org-aurora', defaultFilters);
    const saved = await backend.comment(page.rows[0].id, 'Rollout gate is healthy', 'client-1');
    expect(saved.clientId).toBe('client-1');
    expect(saved.message).toContain('healthy');
  });

  it('lists organization members', async () => {
    const people = await backend.listPeople('org-kestrel');
    expect(people.every((person) => person.organizationIds.includes('org-kestrel'))).toBe(true);
  });

  it('updates member roles', async () => {
    const people = await backend.listPeople('org-kestrel');
    expect((await backend.updateRole(people[0].id, 'observer')).role).toBe('observer');
  });

  it('supports deterministic request ordering', async () => {
    scheduler.setManual(true);
    const first = backend.listChanges('org-aurora', defaultFilters);
    const second = backend.listChanges('org-kestrel', defaultFilters);
    const pending = scheduler.pending();
    scheduler.resolve(pending[1].id);
    expect((await second).organizationId).toBe('org-kestrel');
    scheduler.resolve(pending[0].id);
    expect((await first).organizationId).toBe('org-aurora');
  });
});
