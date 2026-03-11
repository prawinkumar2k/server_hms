import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, LogOut, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Sample notifications - in a real app, these would come from an API
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'info', title: 'Welcome!', message: 'Welcome to the HMS Dashboard', time: 'Just now', read: false },
        { id: 2, type: 'success', title: 'System Update', message: 'System has been updated successfully', time: '5 mins ago', read: false },
        { id: 3, type: 'alert', title: 'Reminder', message: 'Please complete your pending tasks', time: '1 hour ago', read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case 'alert': return <AlertCircle className="h-5 w-5 text-amber-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <header className="h-16 bg-transparent flex items-center justify-end px-4 md:px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Button */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-colors ${showNotifications ? 'bg-slate-100 text-indigo-600' : ''}`}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white font-bold flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.read ? 'bg-indigo-50/50' : ''}`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm font-semibold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); clearNotification(notification.id); }}
                                                            className="text-slate-400 hover:text-slate-600 p-1 -m-1"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{notification.time}</p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="flex-shrink-0">
                                                        <span className="h-2 w-2 bg-indigo-500 rounded-full block"></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-slate-100 bg-slate-50">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(false);
                                            navigate('/admin/monitoring');
                                        }}
                                        className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold py-1"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors group"
                    onClick={logout}
                    title="Click to Logout"
                >
                    <div className="relative">
                        <div className="h-9 w-9 bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100 overflow-hidden">
                            <span className="font-bold text-indigo-700 text-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>

                    <div className="hidden md:block text-left">
                        <h4 className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{user?.full_name || user?.username || 'User'}</h4>
                        <p className="text-xs text-slate-500 truncate">{user?.role || 'Guest'}</p>
                    </div>

                    <LogOut className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </div>
            </div>
        </header>
    );
};

export default Header;
