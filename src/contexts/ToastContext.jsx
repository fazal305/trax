import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3200;

// Lightweight, dependency-free toast/confirmation notifications. Actions
// that used to complete silently (create workspace, create board, ...) call
// showToast() so the user gets visible confirmation.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      const { type = "success", duration = DEFAULT_DURATION } = options;
      const id = nextId.current++;

      setToasts((current) => [...current, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
