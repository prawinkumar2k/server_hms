import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

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

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message) => addToast(message, 'success');
    const error = (message) => addToast(message, 'error');
    const warning = (message) => addToast(message, 'warning');
    const info = (message) => addToast(message, 'info');

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    const styles = {
        success: { bg: 'bg-white', border: 'border-l-4 border-emerald-500', icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
        error: { bg: 'bg-white', border: 'border-l-4 border-red-500', icon: <AlertCircle className="w-5 h-5 text-red-500" /> },
        warning: { bg: 'bg-white', border: 'border-l-4 border-amber-500', icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
        info: { bg: 'bg-white', border: 'border-l-4 border-blue-500', icon: <Info className="w-5 h-5 text-blue-500" /> }
    };

    const style = styles[type] || styles.info;

    return (
        <div className={`
            pointer-events-auto
            flex items-start gap-3 p-4 rounded shadow-lg min-w-[300px] max-w-sm
            transition-all duration-300 transform
            ${style.bg} ${style.border}
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}>
            <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
            <div className="flex-1 text-sm font-medium text-slate-800 break-words">{message}</div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
