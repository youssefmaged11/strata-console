import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

type Toast = {
  id: string;
  tone: 'success' | 'danger' | 'info';
  message: string;
  action?: { label: string; onClick: () => void };
};

const ToastContext = createContext<{ push: (toast: Omit<Toast, 'id'>) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: string) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => dismiss(id), 6500);
  }, [dismiss]);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast ${toast.tone}`} key={toast.id}>
            {toast.tone === 'success' ? <CheckCircle2 /> : toast.tone === 'danger' ? <TriangleAlert /> : <Info />}
            <span>{toast.message}</span>
            {toast.action && <button onClick={toast.action.onClick}>{toast.action.label}</button>}
            <button className="icon-button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}><X /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('ToastProvider is missing');
  return context;
}
