import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Activity, Monitor, Clock,
    Power, RefreshCw, Search,
    MoreHorizontal, AlertTriangle,
    Eye, FileText, Shield, UserCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ROLE_COLORS = {
    'Admin': 'bg-purple-500',
    'Doctor': 'bg-blue-500',
    'Receptionist': 'bg-indigo-500',
    'Lab Technician': 'bg-orange-500',
    'Pharmacist': 'bg-emerald-500',
    'LAB_MASTER': 'bg-red-500',
    'PHARMA_MASTER': 'bg-teal-500',
    'HR': 'bg-rose-500',
};

const Monitoring = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [filterRole, setFilterRole] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeCount, setActiveCount] = useState(0);

    // Modals
    const [profileModal, setProfileModal] = useState({ open: false, user: null });
    const [userLogsModal, setUserLogsModal] = useState({ open: false, user: null, logs: [] });
    const [menuOpenId, setMenuOpenId] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Close menu on outside click
    useEffect(() => {
        const handler = () => setMenuOpenId(null);
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, []);

    // Fetch all data
    const fetchData = async () => {
        try {
            const [usersRes, rolesRes, logsRes] = await Promise.all([
                fetch('/api/admin/users?limit=100', { headers }),
                fetch('/api/admin/roles', { headers }),
                fetch('/api/admin/audit-logs?limit=20', { headers })
            ]);

            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users || []);
                setTotalUsers(data.total || 0);
                setActiveCount((data.users || []).filter(u => u.status === 'Active').length);
            }

            if (rolesRes.ok) {
                const data = await rolesRes.json();
                setRoles(data || []);
            }

            if (logsRes.ok) {
                const data = await logsRes.json();
                setAuditLogs(data.logs || []);
            }
        } catch (error) {
            console.error('Failed to fetch monitoring data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    // Time helpers
    const formatTime = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatTimeAgo = (isoString) => {
        if (!isoString) return '';
        const diff = Math.floor((new Date() - new Date(isoString)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const formatDate = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Log styling
    const getLogStyle = (action) => {
        if (!action) return 'bg-blue-100 text-blue-600';
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return 'bg-emerald-100 text-emerald-600';
        if (a.includes('CREATE') || a.includes('INSERT')) return 'bg-blue-100 text-blue-600';
        if (a.includes('DELETE') || a.includes('REJECT')) return 'bg-red-100 text-red-600';
        if (a.includes('UPDATE') || a.includes('EDIT')) return 'bg-amber-100 text-amber-600';
        if (a.includes('APPROVE')) return 'bg-emerald-100 text-emerald-600';
        return 'bg-purple-100 text-purple-600';
    };

    const getLogIcon = (action) => {
        if (!action) return <Activity className="w-4 h-4" />;
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return <Power className="w-4 h-4" />;
        if (a.includes('DELETE') || a.includes('REJECT')) return <AlertTriangle className="w-4 h-4" />;
        return <Activity className="w-4 h-4" />;
    };

    const getRoleColor = (role) => ROLE_COLORS[role] || 'bg-slate-500';

    // Filter/Search
    const filteredUsers = users.filter(u =>
        (filterRole === 'All' || u.role === filterRole) &&
        (
            (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.role || '').toLowerCase().includes(search.toLowerCase())
        )
    );

    // View user profile modal
    const handleViewProfile = (user) => {
        setProfileModal({ open: true, user });
        setMenuOpenId(null);
    };

    // View user-specific logs
    const handleViewUserLogs = async (user) => {
        setUserLogsModal({ open: true, user, logs: [] });
        setMenuOpenId(null);
        try {
            const res = await fetch(`/api/admin/audit-logs?userId=${user.id}&limit=20`, { headers });
            if (res.ok) {
                const data = await res.json();
                setUserLogsModal(prev => ({ ...prev, logs: data.logs || [] }));
            }
        } catch (err) {
            console.error('Failed to fetch user logs:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading system data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto p-4">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Monitor className="text-indigo-600" />
                        System Control Center
                    </h1>
                    <p className="text-slate-500 mt-1">Real-time user roles, accounts, and audit log monitoring.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-4 py-2 border-r border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase block">Active Users</span>
                        <span className="text-xl font-bold text-slate-800">{activeCount}<span className="text-sm text-slate-400 font-medium">/{totalUsers}</span></span>
                    </div>
                    <div className="px-4 py-2 border-r border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase block">Roles</span>
                        <span className="text-xl font-bold text-slate-800">{roles.length}</span>
                    </div>
                    <div className="px-4 py-2">
                        <span className="text-xs font-bold text-slate-400 uppercase block">Audit Logs</span>
                        <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            {auditLogs.length} recent
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Main: User Table */}
                <div className="xl:col-span-3 space-y-4">
                    {/* Controls */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative group w-full sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search users, roles..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none focus:border-indigo-500"
                            >
                                <option value="All">All Roles</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={cn(
                                "p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200",
                                refreshing && "animate-spin text-indigo-600"
                            )}
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Staff ID</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm",
                                                            getRoleColor(user.role)
                                                        )}>
                                                            {(user.full_name || user.username || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{user.full_name || user.username}</div>
                                                            <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white",
                                                        getRoleColor(user.role)
                                                    )}>
                                                        <Shield className="w-3 h-3" />
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            user.status === 'Inactive' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-slate-100 text-slate-600 border-slate-200'
                                                    )}>
                                                        <span className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            user.status === 'Active' ? 'bg-emerald-500' :
                                                                user.status === 'Inactive' ? 'bg-amber-500' :
                                                                    'bg-slate-400'
                                                        )} />
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600 font-mono">
                                                        {user.staff_id || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-500">{formatDate(user.created_at)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuOpenId(menuOpenId === user.id ? null : user.id);
                                                            }}
                                                            className={cn(
                                                                "p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors",
                                                                menuOpenId === user.id && "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100"
                                                            )}
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>

                                                        {menuOpenId === user.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                                                <div className="p-1">
                                                                    <button onClick={() => handleViewProfile(user)} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors">
                                                                        <Eye className="w-4 h-4" /> View Details
                                                                    </button>
                                                                    <button onClick={() => handleViewUserLogs(user)} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors">
                                                                        <FileText className="w-4 h-4" /> Activity Logs
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                            Showing {filteredUsers.length} of {totalUsers} users
                        </div>
                    </div>
                </div>

                {/* Sidebar: Audit Log Feed */}
                <div className="xl:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 h-full">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            Live Audit Feed
                        </h3>

                        <div className="relative space-y-5 before:absolute before:inset-y-0 before:left-[17px] before:w-0.5 before:bg-slate-100 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                            {auditLogs.length > 0 ? auditLogs.map((log) => (
                                <div key={log.id} className="relative pl-10 group">
                                    <div className={cn(
                                        "absolute left-0 top-1 w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10",
                                        getLogStyle(log.action)
                                    )}>
                                        {getLogIcon(log.action)}
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold text-slate-500">{formatTimeAgo(log.timestamp)}</span>
                                            {log.action && (log.action.toUpperCase().includes('DELETE') || log.action.toUpperCase().includes('REJECT')) && (
                                                <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold">ALERT</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5 group-hover:text-indigo-600 transition-colors">
                                            {log.action || 'Action'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            by {log.user_name || log.username || `User #${log.performed_by}`}
                                        </p>
                                        {log.details && (
                                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2" title={log.details}>
                                                {log.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 pl-10 py-4">No recent activity recorded.</p>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/admin/logs')}
                            className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            View Full Audit Log
                        </button>
                    </div>
                </div>
            </div>

            {/* PROFILE MODAL */}
            {profileModal.open && profileModal.user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100 relative">
                        <button onClick={() => setProfileModal({ open: false, user: null })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-lg">✕</button>
                        <div className="text-center mb-6">
                            <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto mb-3 shadow-lg", getRoleColor(profileModal.user.role))}>
                                {(profileModal.user.full_name || profileModal.user.username || '?').charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{profileModal.user.full_name || profileModal.user.username}</h3>
                            <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white mt-1", getRoleColor(profileModal.user.role))}>
                                {profileModal.user.role}
                            </span>
                        </div>
                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500 font-medium">Username</span>
                                <span className="text-sm text-slate-800 font-mono">@{profileModal.user.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500 font-medium">Status</span>
                                <span className={cn("text-sm font-bold", profileModal.user.status === 'Active' ? 'text-emerald-600' : 'text-slate-500')}>
                                    {profileModal.user.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500 font-medium">Staff ID</span>
                                <span className="text-sm text-slate-800">{profileModal.user.staff_id || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500 font-medium">Staff Name</span>
                                <span className="text-sm text-slate-800">{profileModal.user.staff_name || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500 font-medium">Module Access</span>
                                <span className="text-sm text-slate-800">{profileModal.user.module_access || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-500 font-medium">Created</span>
                                <span className="text-sm text-slate-800">{formatDate(profileModal.user.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* USER LOGS MODAL */}
            {userLogsModal.open && userLogsModal.user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100 relative max-h-[80vh] flex flex-col">
                        <button onClick={() => setUserLogsModal({ open: false, user: null, logs: [] })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-lg">✕</button>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Activity Logs</h3>
                            <p className="text-sm text-slate-500">for <span className="font-bold text-slate-700">{userLogsModal.user.full_name || userLogsModal.user.username}</span></p>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {userLogsModal.logs.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No activity logs found for this user.</p>
                                </div>
                            ) : (
                                userLogsModal.logs.map(log => (
                                    <div key={log.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", getLogStyle(log.action))}>
                                            {getLogIcon(log.action)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800">{log.action}</p>
                                            {log.details && <p className="text-xs text-slate-500 mt-0.5 truncate">{log.details}</p>}
                                            <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(log.timestamp)} • {formatDate(log.timestamp)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Monitoring;
