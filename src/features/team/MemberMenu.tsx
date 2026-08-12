import { useState } from 'react';
import { MoreHorizontal, UserMinus } from 'lucide-react';
import type { Person } from '../../types';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export function MemberMenu({ person, canRemove, onRemove }: { person: Person; canRemove: boolean; onRemove: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <details className="row-menu"><summary aria-label={`Actions for ${person.name}`}><MoreHorizontal /></summary><div className="popover"><button disabled={!canRemove} onClick={() => setConfirming(true)}><UserMinus /> Remove access</button></div></details>
      {confirming && <ConfirmDialog title="Remove organization access?" body={`${person.name} will immediately lose access to this organization.`} confirmLabel="Remove access" onClose={() => setConfirming(false)} onConfirm={() => { onRemove(); setConfirming(false); }} />}
    </>
  );
}
