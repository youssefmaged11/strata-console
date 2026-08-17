import { CircleDot, Factory, ShieldAlert } from 'lucide-react';
import type { ChangeRequest } from '../../types';
import { summarizeChanges } from '../../utils/changeMetrics';

export function ChangeSummary({ changes }: { changes: ChangeRequest[] }) {
  const metrics = summarizeChanges(changes);
  return (
    <div className="change-summary" aria-label="Visible change summary">
      <div><span><CircleDot /> Active</span><strong>{metrics.active}</strong></div>
      <div><span><ShieldAlert /> Critical risk</span><strong>{metrics.critical}</strong></div>
      <div><span><Factory /> Production</span><strong>{metrics.production}</strong></div>
      <div><span>Awaiting approval</span><strong>{metrics.awaitingApproval}</strong></div>
    </div>
  );
}
