import type { Person } from '../types';

export const people: Person[] = [
  { id: 'person-1', name: 'Youssef Maged', email: 'youssef@strata.dev', initials: 'YM', role: 'administrator', presence: 'online', organizationIds: ['org-aurora', 'org-kestrel', 'org-nimbus'] },
  { id: 'person-2', name: 'Maya Chen', email: 'maya@strata.dev', initials: 'MC', role: 'release-manager', presence: 'online', organizationIds: ['org-aurora', 'org-kestrel'] },
  { id: 'person-3', name: 'Noah Williams', email: 'noah@strata.dev', initials: 'NW', role: 'release-manager', presence: 'away', organizationIds: ['org-aurora', 'org-nimbus'] },
  { id: 'person-4', name: 'Priya Raman', email: 'priya@strata.dev', initials: 'PR', role: 'observer', presence: 'online', organizationIds: ['org-aurora'] },
  { id: 'person-5', name: 'Elias Moreau', email: 'elias@strata.dev', initials: 'EM', role: 'release-manager', presence: 'offline', organizationIds: ['org-kestrel'] },
  { id: 'person-6', name: 'Sofia Alvarez', email: 'sofia@strata.dev', initials: 'SA', role: 'observer', presence: 'online', organizationIds: ['org-nimbus'] },
  { id: 'person-7', name: 'Omar Hassan', email: 'omar@strata.dev', initials: 'OH', role: 'release-manager', presence: 'away', organizationIds: ['org-kestrel', 'org-nimbus'] },
  { id: 'person-8', name: 'Avery Brooks', email: 'avery@strata.dev', initials: 'AB', role: 'observer', presence: 'offline', organizationIds: ['org-aurora', 'org-kestrel'] },
];
