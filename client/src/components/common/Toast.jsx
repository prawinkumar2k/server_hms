import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
            borderColor: 'border-red-200'
        }
    };

    const { icon: Icon, bgColor, textColor, iconColor, borderColor } = config[type];

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColor} ${borderColor} min-w-[300px] max-w-md`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
                <p className={`flex-1 font-medium ${textColor}`}>{message}</p>
                <button
                    onClick={onClose}
                    className={`${textColor} hover:opacity-70 transition-opacity`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
