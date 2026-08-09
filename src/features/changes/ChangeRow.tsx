import { MoreHorizontal } from 'lucide-react';
import { people } from '../../data/people';
import type { ChangeRequest } from '../../types';

const relativeTime = (timestamp: number) => {
  const hours = Math.max(1, Math.round((Date.now() - timestamp) / 3_600_000));
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
};

export function ChangeRow({ change, selected, onSelect, onOpen, onDelete }: { change: ChangeRequest; selected: boolean; onSelect: () => void; onOpen: (opener: HTMLButtonElement) => void; onDelete: () => void }) {
  const owner = people.find((person) => person.id === change.ownerId);
  return (
    <tr className={selected ? 'selected' : ''}>
      <td className="check-cell"><input type="checkbox" aria-label={`Select CR-${change.number}`} checked={selected} onChange={onSelect} /></td>
      <td><button className="change-link" onClick={(event) => onOpen(event.currentTarget)}><strong>{change.title}</strong><span>CR-{change.number} · {change.service}</span></button></td>
      <td><span className={`environment ${change.environment}`}>{change.environment}</span></td>
      <td><span className={`risk ${change.risk}`}><i />{change.risk}</span></td>
      <td><span className={`status ${change.status}`}>{change.status.replace('-', ' ')}</span></td>
      <td>{owner ? <span className="owner"><i>{owner.initials}</i>{owner.name}</span> : <span className="muted">Unassigned</span>}</td>
      <td><span className="approval-progress">{change.approvalCount}/{change.requiredApprovals}</span></td>
      <td><span className="updated">{relativeTime(change.updatedAt)}</span></td>
      <td>
        <details className="row-menu">
          <summary aria-label={`Actions for ${change.title}`}><MoreHorizontal /></summary>
          <div className="popover"><button onClick={onDelete}>Delete change</button></div>
        </details>
      </td>
    </tr>
  );
}
