import { useEffect, useRef, useState, type RefObject } from 'react';
import { CalendarClock, Server, ShieldAlert, UserRound } from 'lucide-react';
import { backend } from '../../api/backend';
import { Drawer } from '../../components/Drawer';
import { people } from '../../data/people';
import type { ChangeRequest, Risk } from '../../types';
import { ActivityPanel } from '../activity/ActivityPanel';

export function ChangeDrawer({ change, openerRef, onClose, onMutate }: { change: ChangeRequest; openerRef: RefObject<HTMLElement | null>; onClose: () => void; onMutate: (id: string, patch: Partial<ChangeRequest>) => Promise<unknown> }) {
  const [details, setDetails] = useState(change);
  const [saving, setSaving] = useState(false);
  const initialId = useRef(change.id);
  useEffect(() => { void backend.getChange(change.id).then(setDetails); }, [change.id]);
  return (
    <Drawer title={`CR-${change.number}`} openerRef={openerRef} onClose={onClose}>
      <div className="drawer-content">
        <div className="drawer-title"><span className={`risk ${details.risk}`}><i />{details.risk} risk</span><h1>{change.title}</h1><p>{details.summary}</p></div>
        <div className="detail-grid">
          <label><span><UserRound /> Owner</span><select value={details.ownerId ?? ''} disabled={saving} onChange={async (event) => { const ownerId = event.target.value || null; setDetails((current) => ({ ...current, ownerId })); setSaving(true); await onMutate(initialId.current, { ownerId }); setSaving(false); }}><option value="">Unassigned</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label><span><ShieldAlert /> Risk</span><select value={details.risk} disabled={saving} onChange={async (event) => { const risk = event.target.value as Risk; setDetails((current) => ({ ...current, risk })); setSaving(true); await onMutate(initialId.current, { risk }); setSaving(false); }}><option value="critical">Critical</option><option value="high">High</option><option value="moderate">Moderate</option><option value="low">Low</option></select></label>
          <div><span><Server /> Service</span><strong>{details.service}</strong></div>
          <div><span><CalendarClock /> Scheduled</span><strong>{new Date(details.scheduledAt).toLocaleString()}</strong></div>
        </div>
        <div className="tag-list">{details.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <ActivityPanel changeId={change.id} />
      </div>
    </Drawer>
  );
}
