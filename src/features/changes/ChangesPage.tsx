import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { useOrganization } from '../../app/OrganizationProvider';
import { useSession } from '../../app/SessionProvider';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Pagination } from '../../components/Pagination';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { ChangeFilters as Filters, ChangeRequest } from '../../types';
import { defaultFilters, filtersFromSearch, filtersToSearch } from '../../utils/filterUrl';
import { SavedViewPicker } from '../savedViews/SavedViewPicker';
import { BulkActions } from './BulkActions';
import { ChangeDrawer } from './ChangeDrawer';
import { ChangeFilters } from './ChangeFilters';
import { ChangeSummary } from './ChangeSummary';
import { ChangeTable } from './ChangeTable';
import { useChangeMutations } from './useChangeMutations';
import { useChangeSelection } from './useChangeSelection';
import { useChanges } from './useChanges';

export function ChangesPage() {
  const { organization } = useOrganization();
  const { user } = useSession();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => filtersFromSearch(params));
  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const queryFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [debouncedSearch, filters]);
  const changes = useChanges(organization.id, queryFilters);
  const selection = useChangeSelection(changes.rows.map((row) => row.id));
  const mutations = useChangeMutations(changes.updateLocal, changes.removeLocal);
  const [openChange, setOpenChange] = useState<ChangeRequest | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const next = filtersFromSearch(params);
    setFilters((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
  }, [params]);
  useEffect(() => { setParams(filtersToSearch(filters), { replace: true }); }, [filters, setParams]);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'r' && selection.selectedIds.length > 0) {
        event.preventDefault();
        document.querySelector<HTMLSelectElement>('.bulk-bar select')?.focus();
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const loadView = (next: Filters) => setFilters({ ...defaultFilters, ...next });
  return (
    <div className="changes-page">
      <header className="page-header">
        <div><SavedViewPicker organizationId={organization.id} ownerId={user.id} filters={filters} onLoad={loadView} /><div className="title-row"><h1>Change requests</h1><span>{changes.total}</span></div><p>Coordinate approvals and production rollouts across your services.</p></div>
        <div className="header-actions"><button className="button secondary" onClick={changes.refresh} disabled={changes.loading}><RefreshCw /> Refresh</button><button className="button primary"><Plus /> New change</button></div>
      </header>
      <ChangeSummary changes={changes.rows} />
      <section className="card change-card">
        <ChangeFilters filters={filters} onChange={setFilters} />
        {selection.selected.size > 0 && <BulkActions count={selection.selected.size} onClear={selection.clear} onRisk={(risk) => void mutations.bulkRisk(selection.selectedIds, risk)} />}
        {changes.error && <div className="error-banner"><AlertCircle />{changes.error}<button onClick={changes.refresh}>Try again</button></div>}
        <ChangeTable rows={changes.rows} selected={selection.selected} onToggle={selection.toggle} onTogglePage={selection.togglePage} onOpen={(change, opener) => { openerRef.current = opener; setOpenChange(change); }} onDelete={setDeleteIndex} />
        {changes.loading && <div className="table-loading"><span /></div>}
        <footer className="table-footer"><span className="sync-state"><i /> Background sync active</span><Pagination page={filters.page} pageCount={changes.pageCount} total={changes.total} pageSize={filters.pageSize} onChange={(page) => setFilters((current) => ({ ...current, page }))} /></footer>
      </section>
      {openChange && <ChangeDrawer change={openChange} openerRef={openerRef} onClose={() => setOpenChange(null)} onMutate={mutations.mutate} />}
      {deleteIndex !== null && <ConfirmDialog title="Delete change request?" body="This change request and its audit comments will be permanently removed." confirmLabel="Delete change" onClose={() => setDeleteIndex(null)} onConfirm={() => { const target = changes.rows[deleteIndex]; if (target) void mutations.deleteChange(target.id); setDeleteIndex(null); }} />}
    </div>
  );
}
