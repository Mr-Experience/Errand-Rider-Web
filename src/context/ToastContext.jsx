import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, exit: true } : t));
    
    // Actually remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 2000) => {
    const id = Date.now();
    
    // Clear all existing toasts immediately to replace with the new one
    setToasts([{ id, message, type, exit: false }]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error') }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type} ${toast.exit ? 'toast-exit' : ''}`}
          >
            <div className="toast-icon">
              {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            <div className="toast-content">{toast.message}</div>
            <button 
              className="toast-close" 
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
