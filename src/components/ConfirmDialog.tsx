import { Modal } from './Modal';

export function ConfirmDialog({ title, body, confirmLabel, onClose, onConfirm }: { title: string; body: string; confirmLabel: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="modal-copy">{body}</p>
      <footer className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancel</button>
        <button className="button danger" onClick={onConfirm}>{confirmLabel}</button>
      </footer>
    </Modal>
  );
}
