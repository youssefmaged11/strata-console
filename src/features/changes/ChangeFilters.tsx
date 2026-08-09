import { Filter, Search } from 'lucide-react';
import { people } from '../../data/people';
import type { ChangeFilters as Filters, ChangeStatus, Risk } from '../../types';

const statuses: { value: ChangeStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'awaiting-approval', label: 'Awaiting approval' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'deploying', label: 'Deploying' },
  { value: 'completed', label: 'Completed' },
  { value: 'rolled-back', label: 'Rolled back' },
];
const risks: { value: Risk; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low' },
];

export function ChangeFilters({ filters, onChange }: { filters: Filters; onChange: (next: Filters | ((current: Filters) => Filters)) => void }) {
  const toggle = <T extends string>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
  return (
    <div className="filters">
      <label className="search-field"><Search /><input value={filters.search} placeholder="Search changes, services, or owners" onChange={(event) => onChange((current) => ({ ...current, search: event.target.value, page: 1 }))} /></label>
      <details className="filter-menu">
        <summary><Filter /> Status {filters.statuses.length > 0 && <em>{filters.statuses.length}</em>}</summary>
        <div className="popover checklist">
          {statuses.map((status) => <label key={status.value}><input type="checkbox" checked={filters.statuses.includes(status.value)} onChange={() => onChange((current) => ({ ...current, statuses: toggle(current.statuses, status.value), page: 1 }))} />{status.label}</label>)}
        </div>
      </details>
      <details className="filter-menu">
        <summary>Risk {filters.risks.length > 0 && <em>{filters.risks.length}</em>}</summary>
        <div className="popover checklist">
          {risks.map((risk) => <label key={risk.value}><input type="checkbox" checked={filters.risks.includes(risk.value)} onChange={() => onChange((current) => ({ ...current, risks: toggle(current.risks, risk.value), page: 1 }))} />{risk.label}</label>)}
        </div>
      </details>
      <select aria-label="Filter by owner" value={filters.ownerId} onChange={(event) => onChange((current) => ({ ...current, ownerId: event.target.value, page: 1 }))}>
        <option value="">All owners</option>
        {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
      </select>
      <select aria-label="Sort changes" value={filters.sort} onChange={(event) => onChange((current) => ({ ...current, sort: event.target.value as Filters['sort'] }))}>
        <option value="updated-desc">Recently updated</option>
        <option value="updated-asc">Oldest update</option>
        <option value="risk">Highest risk</option>
        <option value="scheduled">Scheduled time</option>
      </select>
    </div>
  );
}
