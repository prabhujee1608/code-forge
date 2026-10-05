import React, { createContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toastHelpers = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 animate-fade-in ${
                isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                  : isError
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                  : isWarning
                  ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
                  : 'bg-slate-900/90 border-indigo-500/40 text-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                {!isSuccess && !isError && !isWarning && (
                  <Info className="w-5 h-5 text-indigo-400 shrink-0" />
                )}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
