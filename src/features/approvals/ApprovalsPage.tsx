import { Check, Clock3, RefreshCw, ShieldCheck } from 'lucide-react';
import { useOrganization } from '../../app/OrganizationProvider';
import { useApprovals } from './useApprovals';

export function ApprovalsPage() {
  const { organization } = useOrganization();
  const { approvals, loading, approve, refresh } = useApprovals(organization.id);
  const pending = approvals.filter((approval) => !approval.approved);
  const critical = pending.filter((approval) => approval.risk === 'critical').length;
  return (
    <div className="panel-page">
      <header className="page-header"><div><span className="eyebrow">Release governance</span><h1>Approvals</h1><p>Changes waiting for review in {organization.name}.</p></div><button className="button secondary" onClick={() => void refresh()}><RefreshCw /> Refresh</button></header>
      <div className="metric-grid"><article><span><Clock3 /> Pending</span><strong>{pending.length}</strong><small>{critical} critical-risk changes</small></article><article><span><ShieldCheck /> Median review</span><strong>8m 24s</strong><small className="positive">18% faster this week</small></article><article><span>Policy coverage</span><strong>97.6%</strong><small>Across active services</small></article></div>
      <section className="card"><header className="card-header"><div><h2>Approval queue</h2><p>Newest requests are shown first</p></div></header>{loading ? <div className="loading-state">Loading approvals…</div> : <ul className="approval-list">{approvals.map((approval) => <li className={approval.approved ? 'approved' : ''} key={approval.id}><span className={`risk-dot ${approval.risk}`} /><div><strong>CR-{approval.changeNumber} · {approval.title}</strong><span>Requested by {approval.requestedBy}</span></div>{approval.approved ? <span className="approved-label"><Check /> Approved</span> : <button className="button secondary small" onClick={() => void approve(approval.id)}>Approve</button>}</li>)}</ul>}</section>
    </div>
  );
}
