import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, ShieldCheck } from 'lucide-react';
import { backend } from '../../api/backend';
import { useOrganization } from '../../app/OrganizationProvider';
import { useSession } from '../../app/SessionProvider';
import { useToast } from '../../components/ToastProvider';
import type { Person, Role } from '../../types';
import { MemberMenu } from './MemberMenu';
import { usePermissions } from './usePermissions';

export function TeamPage() {
  const { organization } = useOrganization();
  const { user } = useSession();
  const { push } = useToast();
  const can = usePermissions();
  const [members, setMembers] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const load = useCallback(() => { void backend.listPeople(organization.id).then(setMembers); }, [organization.id]);
  useEffect(load, [load]);
  const updateRole = async (id: string, role: Role) => {
    setMembers((current) => current.map((member) => member.id === id ? { ...member, role } : member));
    try {
      const saved = await backend.updateRole(id, role);
      setMembers((current) => current.map((member) => member.id === id ? saved : member));
      push({ tone: 'success', message: 'Role updated' });
    } catch {
      load();
    }
  };
  const remove = async (id: string) => {
    await backend.removePerson(id, organization.id);
    setMembers((current) => current.filter((member) => member.id !== id));
    push({ tone: 'success', message: 'Organization access removed' });
  };
  const filtered = members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="panel-page">
      <header className="page-header"><div><span className="eyebrow">Organization settings</span><h1>Team & access</h1><p>Manage people and release permissions for {organization.name}.</p></div><button className="button primary" disabled={!can('team:edit')}><Plus /> Invite person</button></header>
      <div className="role-banner"><ShieldCheck /><div><strong>Your role: {user.role.replace('-', ' ')}</strong><p>Permissions update automatically when organization access changes.</p></div></div>
      <section className="card"><header className="card-header"><div><h2>People</h2><p>{members.length} people have access</p></div><label className="search-field compact"><Search /><input value={query} placeholder="Search people" onChange={(event) => setQuery(event.target.value)} /></label></header><div className="member-list">{filtered.map((member) => <div className="member-row" key={member.id}><span className="avatar large">{member.initials}<i className={member.presence} /></span><div className="member-identity"><strong>{member.name}{member.id === user.id && <em>You</em>}</strong><span>{member.email}</span></div><select aria-label={`Role for ${member.name}`} value={member.role} disabled={!can('team:edit') || member.id === user.id} onChange={(event) => void updateRole(member.id, event.target.value as Role)}><option value="administrator">Administrator</option><option value="release-manager">Release manager</option><option value="observer">Observer</option></select><span className={`presence ${member.presence}`}>{member.presence}</span><MemberMenu person={member} canRemove={can('team:edit') && member.id !== user.id} onRemove={() => void remove(member.id)} /></div>)}</div></section>
    </div>
  );
}
