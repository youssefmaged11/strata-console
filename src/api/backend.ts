import { approvals as approvalSeeds } from '../data/approvals';
import { changes as changeSeeds } from '../data/changes';
import { people as peopleSeeds } from '../data/people';
import type { ActivityEvent, Approval, ChangeFilters, ChangeRequest, Person, Risk, Role } from '../types';
import { filterChanges, sortChanges } from '../utils/changeFilters';
import { scheduler } from './scheduler';

let changes = structuredClone(changeSeeds);
let approvals = structuredClone(approvalSeeds);
let people = structuredClone(peopleSeeds);
let activitySequence = 400;
const activitySeeds: ActivityEvent[] = changes.slice(0, 90).flatMap((change, index) => [
  {
    id: `event-${index * 2 + 1}`,
    changeId: change.id,
    kind: 'created' as const,
    actor: change.requestedBy,
    message: 'Created the change request',
    createdAt: change.updatedAt - 3_600_000,
  },
  {
    id: `event-${index * 2 + 2}`,
    changeId: change.id,
    kind: 'status' as const,
    actor: 'Strata automation',
    message: `Moved the change to ${change.status.replace('-', ' ')}`,
    createdAt: change.updatedAt,
  },
]);
let activities = structuredClone(activitySeeds);

const clone = <T,>(value: T): T => structuredClone(value);

export type ChangePage = {
  rows: ChangeRequest[];
  inventory: string[];
  total: number;
  pageCount: number;
  organizationId: string;
};

export const backend = {
  reset() {
    changes = clone(changeSeeds);
    approvals = clone(approvalSeeds);
    people = clone(peopleSeeds);
    activities = clone(activitySeeds);
    activitySequence = 400;
  },

  async listChanges(organizationId: string, filters: ChangeFilters): Promise<ChangePage> {
    await scheduler.wait(`changes:${organizationId}:${filters.search}:${filters.page}`, filters.search ? 190 : 100);
    const scoped = changes.filter((change) => change.organizationId === organizationId);
    const inventory = scoped.map((change) => change.id);
    const filtered = sortChanges(filterChanges(scoped, filters), filters.sort);
    const pageCount = Math.max(1, Math.ceil(filtered.length / filters.pageSize));
    const start = (filters.page - 1) * filters.pageSize;
    return clone({
      rows: filtered.slice(start, start + filters.pageSize),
      inventory,
      total: filtered.length,
      pageCount,
      organizationId,
    });
  },

  async getChange(id: string) {
    await scheduler.wait(`change:${id}`, 130);
    const change = changes.find((item) => item.id === id);
    if (!change) throw new Error('Change request not found');
    return clone(change);
  },

  async updateChange(
    id: string,
    patch: Partial<Pick<ChangeRequest, 'ownerId' | 'risk' | 'status'>>,
    operationId: string,
  ) {
    await scheduler.wait(`mutation:${id}:${operationId}`, 170);
    if (operationId.includes('fail')) throw new Error('The change could not be saved');
    const change = changes.find((item) => item.id === id);
    if (!change) throw new Error('Change request not found');
    Object.assign(change, patch, { updatedAt: Date.now(), version: change.version + 1 });
    activities.unshift({
      id: `event-${++activitySequence}`,
      changeId: id,
      kind: patch.ownerId !== undefined ? 'owner' : 'status',
      actor: 'Youssef Maged',
      message: `Updated ${Object.keys(patch)[0]}`,
      createdAt: Date.now(),
      clientId: operationId,
    });
    return clone(change);
  },

  async bulkRisk(ids: string[], risk: Risk) {
    await scheduler.wait(`bulk-risk:${ids.join(',')}`, 220);
    return Promise.all(ids.map(async (id, index) => {
      if (index % 6 === 2) return { id, ok: false as const };
      return { id, ok: true as const, change: await backend.updateChange(id, { risk }, `bulk-${id}`) };
    }));
  },

  async deleteChange(id: string) {
    await scheduler.wait(`delete:${id}`, 140);
    changes = changes.filter((change) => change.id !== id);
    approvals = approvals.filter((approval) => approval.changeId !== id);
    return id;
  },

  async listApprovals(organizationId: string) {
    await scheduler.wait(`approvals:${organizationId}`, 115);
    return clone(approvals.filter((approval) => approval.organizationId === organizationId));
  },

  async approve(id: string, operationId: string) {
    await scheduler.wait(`approval:${id}:${operationId}`, 155);
    if (operationId.includes('fail')) throw new Error('Approval was not recorded');
    const approval = approvals.find((item) => item.id === id);
    if (!approval) throw new Error('Approval not found');
    approval.approved = true;
    approval.version += 1;
    return clone(approval);
  },

  async activity(changeId: string, cursor = 0) {
    await scheduler.wait(`activity:${changeId}:${cursor}`, 125);
    return clone(activities.filter((event) => event.changeId === changeId).slice(cursor, cursor + 20));
  },

  async comment(changeId: string, message: string, clientId: string) {
    await scheduler.wait(`comment:${changeId}:${clientId}`, 110);
    const event: ActivityEvent = {
      id: `event-${++activitySequence}`,
      changeId,
      kind: 'comment',
      actor: 'Youssef Maged',
      message,
      createdAt: Date.now(),
      clientId,
    };
    activities.unshift(event);
    return clone(event);
  },

  async listPeople(organizationId: string) {
    await scheduler.wait(`people:${organizationId}`, 80);
    return clone(people.filter((person) => person.organizationIds.includes(organizationId)));
  },

  async updateRole(id: string, role: Role) {
    await scheduler.wait(`role:${id}`, 120);
    const person = people.find((item) => item.id === id);
    if (!person) throw new Error('Person not found');
    person.role = role;
    return clone(person);
  },

  async removePerson(id: string, organizationId: string) {
    await scheduler.wait(`remove-person:${id}:${organizationId}`, 140);
    const person = people.find((item) => item.id === id);
    if (!person) throw new Error('Person not found');
    person.organizationIds = person.organizationIds.filter((item) => item !== organizationId);
    return id;
  },
};
