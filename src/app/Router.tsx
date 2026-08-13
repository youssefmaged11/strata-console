import { Navigate, Route, Routes } from 'react-router-dom';
import { ApprovalsPage } from '../features/approvals/ApprovalsPage';
import { ChangesPage } from '../features/changes/ChangesPage';
import { TeamPage } from '../features/team/TeamPage';
import { AppShell } from './AppShell';

function Placeholder({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="panel-page"><header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></header><section className="card placeholder"><span>◫</span><h2>{title} workspace</h2><p>This operational surface is ready for organization-specific data.</p></section></div>;
}

export function Router() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/changes" replace />} />
        <Route path="changes" element={<ChangesPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="overview" element={<Placeholder eyebrow="Operations" title="Overview" copy="Monitor release health and organization risk." />} />
        <Route path="activity" element={<Placeholder eyebrow="Audit" title="Activity" copy="Review organization-wide change activity." />} />
        <Route path="services" element={<Placeholder eyebrow="Catalog" title="Services" copy="Manage ownership and release policy coverage." />} />
        <Route path="settings" element={<Placeholder eyebrow="Configuration" title="Settings" copy="Configure organization defaults and integrations." />} />
      </Route>
      <Route path="*" element={<Navigate to="/changes" replace />} />
    </Routes>
  );
}
