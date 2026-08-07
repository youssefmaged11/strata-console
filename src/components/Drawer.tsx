import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';

export function Drawer({ title, onClose, openerRef, children }: { title: string; onClose: () => void; openerRef?: RefObject<HTMLElement | null>; children: ReactNode }) {
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    panelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      openerRef?.current?.focus();
    };
  }, [onClose, openerRef]);
  return (
    <div className="drawer-layer">
      <button className="drawer-scrim" aria-label="Close drawer" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-heading" tabIndex={-1} ref={panelRef}>
        <header className="drawer-header">
          <div><span className="eyebrow">Change request</span><h2 id="drawer-heading">{title}</h2></div>
          <button className="icon-button" aria-label="Close" onClick={onClose}><X /></button>
        </header>
        {children}
      </aside>
    </div>
  );
}
