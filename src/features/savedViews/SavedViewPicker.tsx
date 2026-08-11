import { useState } from 'react';
import { Bookmark, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import type { ChangeFilters } from '../../types';
import { useSavedViews } from './useSavedViews';

export function SavedViewPicker({ organizationId, ownerId, filters, onLoad }: { organizationId: string; ownerId: string; filters: ChangeFilters; onLoad: (filters: ChangeFilters) => void }) {
  const { views, save, remove } = useSavedViews(organizationId, ownerId);
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');
  return (
    <>
      <details className="saved-picker">
        <summary><Bookmark /> All changes <ChevronDown /></summary>
        <div className="popover saved-menu">
          <span className="menu-label">Saved views</span>
          {views.length > 0 ? views.map((view) => <div className="saved-item" key={view.id}><button onClick={() => onLoad(view.filters)}><Bookmark />{view.name}</button><button aria-label={`Delete ${view.name}`} onClick={() => remove(view.id)}><Trash2 /></button></div>) : <p>No saved views yet</p>}
          <button className="new-view" onClick={() => setShowSave(true)}><Plus /> Save current view</button>
        </div>
      </details>
      {showSave && <Modal title="Save current view" onClose={() => setShowSave(false)}><form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; save(name.trim(), filters); setName(''); setShowSave(false); }}><label className="field">View name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. High-risk production" /></label><p className="hint">Search, filters, sorting, and pagination will be saved.</p><footer className="modal-actions"><button type="button" className="button secondary" onClick={() => setShowSave(false)}>Cancel</button><button className="button primary" disabled={!name.trim()}>Save view</button></footer></form></Modal>}
    </>
  );
}
