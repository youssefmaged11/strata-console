import { Activity, Bell, ChevronDown, Command, FileCheck2, Gauge, Layers3, Search, Settings, ShieldCheck, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApprovals } from '../features/approvals/useApprovals';
import { useOrganization } from './OrganizationProvider';
import { useSession } from './SessionProvider';

export function AppShell() {
  const { organization, organizations, setOrganizationId } = useOrganization();
  const { user } = useSession();
  const { approvals } = useApprovals(organization.id);
  const pending = approvals.filter((approval) => !approval.approved).length;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span><Layers3 /></span><strong>Strata</strong><em>PRO</em></div>
        <label className="organization-picker"><span style={{ background: organization.accent }}>{organization.slug}</span><select aria-label="Switch organization" value={organization.id} onChange={(event) => setOrganizationId(event.target.value)}>{organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown /></label>
        <nav>
          <span className="nav-heading">Operations</span>
          <NavLink to="/overview"><Gauge /> Overview</NavLink>
          <NavLink to="/changes"><Command /> Change requests</NavLink>
          <NavLink to="/approvals"><FileCheck2 /> Approvals {pending > 0 && <em>{pending}</em>}</NavLink>
          <NavLink to="/activity"><Activity /> Activity</NavLink>
          <span className="nav-heading">Manage</span>
          <NavLink to="/team"><Users /> Team & access</NavLink>
          <NavLink to="/services"><ShieldCheck /> Services</NavLink>
          <NavLink to="/settings"><Settings /> Settings</NavLink>
        </nav>
        <div className="sidebar-footer"><div className="user-card"><span className="avatar">{user.initials}<i className={user.presence} /></span><div><strong>{user.name}</strong><span>{user.email}</span></div><ChevronDown /></div></div>
      </aside>
      <main><div className="topbar"><button className="command-search"><Search /> Search Strata… <kbd>⌘ K</kbd></button><div><button className="icon-button" aria-label="System status"><ShieldCheck /></button><button className="icon-button notification" aria-label="Notifications"><Bell />{pending > 0 && <i />}</button></div></div><Outlet /></main>
    </div>
  );
}
