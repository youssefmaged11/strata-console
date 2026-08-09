import type { ChangeRequest } from '../../types';
import { ChangeRow } from './ChangeRow';

export function ChangeTable({ rows, selected, onToggle, onTogglePage, onOpen, onDelete }: { rows: ChangeRequest[]; selected: Set<string>; onToggle: (id: string) => void; onTogglePage: () => void; onOpen: (change: ChangeRequest, opener: HTMLButtonElement) => void; onDelete: (index: number) => void }) {
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <div className="table-wrap" tabIndex={-1}>
      <table>
        <thead><tr><th className="check-cell"><input type="checkbox" aria-label="Select this page" checked={allSelected} onChange={onTogglePage} /></th><th>Change</th><th>Environment</th><th>Risk</th><th>Status</th><th>Owner</th><th>Approvals</th><th>Updated</th><th /></tr></thead>
        <tbody>{rows.map((row, index) => <ChangeRow key={row.id} change={row} selected={selected.has(row.id)} onSelect={() => onToggle(row.id)} onOpen={(opener) => onOpen(row, opener)} onDelete={() => onDelete(index)} />)}</tbody>
      </table>
      {rows.length === 0 && <div className="empty-state"><span>⌁</span><h3>No changes found</h3><p>Try adjusting the filters or search query.</p></div>}
    </div>
  );
}
