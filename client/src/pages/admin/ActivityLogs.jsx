import React, { useState, useEffect } from 'react';
import { logService } from '../../services/userManagementService';
import {
    Search, Calendar, RefreshCw, ChevronLeft, ChevronRight,
    FileText, Activity, Power, AlertTriangle, Shield,
    Filter, Download, Clock, User
} from 'lucide-react';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 25;

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        startDate: '',
        endDate: '',
        actionType: ''
    });

    // Expandable row
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (page === 1) fetchLogs();
            else setPage(1); // Reset to page 1 on filter change
        }, 400);
        return () => clearTimeout(timeout);
    }, [filters.search, filters.startDate, filters.endDate, filters.actionType]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit,
                username: filters.search || undefined,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined
            };

            const data = await logService.getLogs(params);
            let fetchedLogs = data.logs || [];

            // Client-side action type filter (backend doesn't support this param yet)
            if (filters.actionType) {
                fetchedLogs = fetchedLogs.filter(log =>
                    (log.action || '').toUpperCase().includes(filters.actionType.toUpperCase())
                );
            }

            setLogs(fetchedLogs);
            setTotalCount(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchLogs();
    };

    const handleClearFilters = () => {
        setFilters({ search: '', startDate: '', endDate: '', actionType: '' });
        setPage(1);
    };

    // Export to CSV
    const handleExport = () => {
        if (logs.length === 0) return;
        const headers = ['Timestamp', 'User', 'Role', 'Action', 'Details'];
        const rows = logs.map(log => [
            new Date(log.created_at || log.timestamp).toLocaleString(),
            log.user_name || `User #${log.performed_by}`,
            log.user_role || '-',
            log.action || '-',
            (log.details || '').replace(/,/g, ';')
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Styling helpers
    const getActionStyle = (action) => {
        if (!action) return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: <Activity className="w-3.5 h-3.5" /> };
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <Power className="w-3.5 h-3.5" /> };
        if (a.includes('CREATE') || a.includes('INSERT') || a.includes('REGISTER')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <Activity className="w-3.5 h-3.5" /> };
        if (a.includes('UPDATE') || a.includes('EDIT') || a.includes('MODIFY')) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Activity className="w-3.5 h-3.5" /> };
        if (a.includes('DELETE') || a.includes('REMOVE')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
        if (a.includes('APPROVE')) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <Shield className="w-3.5 h-3.5" /> };
        if (a.includes('REJECT') || a.includes('DENY')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: <Activity className="w-3.5 h-3.5" /> };
    };

    const formatTimestamp = (iso) => {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
            d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatTimeAgo = (iso) => {
        if (!iso) return '';
        const diff = Math.floor((new Date() - new Date(iso)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const hasActiveFilters = filters.search || filters.startDate || filters.endDate || filters.actionType;

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-600" />
                        System Audit Logs
                    </h1>
                    <p className="text-slate-500 mt-1">Track all user activities and system events across the HMS platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Stats pill */}
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="text-center">
                            <span className="text-xs text-slate-400 block font-medium">Total Logs</span>
                            <span className="text-lg font-bold text-slate-800">{totalCount.toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={logs.length === 0}
                        className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button
                        onClick={handleRefresh}
                        className={`px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm ${refreshing ? 'opacity-75' : ''}`}
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</span>
                    {hasActiveFilters && (
                        <button onClick={handleClearFilters} className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-semibold">
                            Clear All
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by user..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none bg-slate-50 focus:bg-white transition-colors"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 bg-slate-50 focus:bg-white transition-colors"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            title="Start Date"
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 bg-slate-50 focus:bg-white transition-colors"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            title="End Date"
                        />
                    </div>
                    <select
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 focus:bg-white transition-colors"
                        value={filters.actionType}
                        onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
                    >
                        <option value="">All Actions</option>
                        <option value="LOGIN">Login</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                        <option value="APPROVE">Approve</option>
                        <option value="REJECT">Reject</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-4 w-52">Timestamp</th>
                                <th className="p-4 w-44">User</th>
                                <th className="p-4 w-32">Role</th>
                                <th className="p-4 w-40">Action</th>
                                <th className="p-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
                                        <p className="text-slate-400">Loading audit logs...</p>
                                    </td>
                                </tr>
                            ) : logs.length > 0 ? (
                                logs.map(log => {
                                    const style = getActionStyle(log.action);
                                    const isExpanded = expandedId === log.id;
                                    return (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                            onClick={() => setExpandedId(isExpanded ? null : log.id)}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <div>
                                                        <div className="text-slate-700 font-medium whitespace-nowrap">
                                                            {formatTimestamp(log.created_at || log.timestamp)}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{formatTimeAgo(log.created_at || log.timestamp)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {(log.user_name || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-slate-800 truncate">
                                                        {log.user_name || `User #${log.performed_by}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {log.user_role ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                        <Shield className="w-3 h-3" />
                                                        {log.user_role}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                                    {style.icon}
                                                    {log.action || 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className={`text-slate-600 ${isExpanded ? '' : 'truncate max-w-md'}`}>
                                                    {log.details || <span className="text-slate-300 italic">No details</span>}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-400">No audit logs found matching the current filters.</p>
                                        {hasActiveFilters && (
                                            <button onClick={handleClearFilters} className="mt-2 text-sm text-indigo-600 hover:underline font-medium">
                                                Clear all filters
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-bold text-slate-800">{logs.length}</span> of <span className="font-bold text-slate-800">{totalCount.toLocaleString()}</span> entries
                        {' '}• Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(1)}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            First
                        </button>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {/* Page number pills */}
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page === pageNum
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'border border-slate-200 text-slate-600 hover:bg-white'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(totalPages)}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
