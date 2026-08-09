import { ShieldAlert, X } from 'lucide-react';
import type { Risk } from '../../types';

export function BulkActions({ count, onClear, onRisk }: { count: number; onClear: () => void; onRisk: (risk: Risk) => void }) {
  return (
    <div className="bulk-bar" aria-live="polite">
      <strong>{count} {count === 1 ? 'change' : 'changes'} selected</strong>
      <span />
      <label><ShieldAlert /> Set risk<select aria-label="Set risk for selected changes" defaultValue="" onChange={(event) => { if (event.target.value) onRisk(event.target.value as Risk); event.target.value = ''; }}><option value="" disabled>Choose…</option><option value="critical">Critical</option><option value="high">High</option><option value="moderate">Moderate</option><option value="low">Low</option></select></label>
      <button className="icon-button" aria-label="Clear selection" onClick={onClear}><X /></button>
    </div>
  );
}
