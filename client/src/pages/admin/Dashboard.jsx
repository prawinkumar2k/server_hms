import React, { useState, useEffect } from 'react';
import {
    Users, Activity, ShieldCheck, Calendar,
    DollarSign, Clock, Search, X,
    Bed, UserCheck, RefreshCw, TrendingUp
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchDashboardData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                fetch('/api/admin/dashboard-stats', { headers }),
                fetch('/api/admin/dashboard-analytics', { headers })
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data.stats);
                setRecentActivity(data.recentActivity || []);
            }

            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setAnalytics(data);
            }

            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, []);

    // Search debounce
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (searchTerm.length > 1) {
                try {
                    const res = await fetch(`/api/admin/search?q=${searchTerm}`, { headers });
                    if (res.ok) { setSearchResults(await res.json()); setShowResults(true); }
                } catch (e) { console.error(e); }
            } else { setSearchResults(null); setShowResults(false); }
        }, 500);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    // Custom Tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
                    {payload.map((entry, i) => (
                        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
                            {entry.name}: {typeof entry.value === 'number' && entry.name === 'Revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const statCards = stats ? [
        { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: "Today's Appointments", value: stats.todayAppointments.toLocaleString(), icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'Active Doctors', value: stats.activeDoctors.toLocaleString(), icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: "Today's Revenue", value: `₹${Number(stats.todayRevenue).toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: UserCheck, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
        { label: 'Bed Occupancy', value: `${stats.occupiedBeds} / ${stats.totalBeds}`, icon: Bed, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    ] : [];

    const getActivityColor = (action) => {
        if (!action) return 'bg-slate-400';
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return 'bg-blue-500';
        if (a.includes('CREATE') || a.includes('INSERT')) return 'bg-emerald-500';
        if (a.includes('UPDATE') || a.includes('EDIT')) return 'bg-amber-500';
        if (a.includes('DELETE')) return 'bg-red-500';
        return 'bg-purple-500';
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-2">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time hospital metrics and analytics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchDashboardData} className="bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Refresh'}
                    </button>
                    <div className="relative">
                        <div className="relative">
                            <input type="text" placeholder="Search all modules..." className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onFocus={() => searchTerm.length > 1 && setShowResults(true)} />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            {searchTerm && <button onClick={() => { setSearchTerm(''); setShowResults(false); }} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
                        </div>
                        {showResults && searchResults && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden max-h-96 overflow-y-auto">
                                {Object.values(searchResults).every(arr => !arr || arr.length === 0) ? (
                                    <div className="p-4 text-center text-slate-500">No results found.</div>
                                ) : (
                                    <>
                                        {searchResults.users?.length > 0 && (
                                            <div>
                                                <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Users</div>
                                                {searchResults.users.map(u => <div key={u.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer"><p className="font-medium text-slate-800">{u.full_name}</p><p className="text-xs text-slate-500">{u.role}</p></div>)}
                                            </div>
                                        )}
                                        {searchResults.patients?.length > 0 && (
                                            <div>
                                                <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Patients</div>
                                                {searchResults.patients.map(p => <div key={p.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer"><p className="font-medium text-slate-800">{p.name}</p><p className="text-xs text-slate-500">{p.mobile} • {p.gender}</p></div>)}
                                            </div>
                                        )}
                                        {searchResults.appointments?.length > 0 && (
                                            <div>
                                                <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Appointments</div>
                                                {searchResults.appointments.map(a => <div key={a.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer"><p className="font-medium text-slate-800">{a.patient_name}</p><p className="text-xs text-slate-500">with {a.doctor_name} • {a.status}</p></div>)}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        {showResults && <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)}></div>}
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {statCards.map((stat, i) => (
                    <div key={i} className={`bg-white rounded-xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-all duration-200`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1: Patient Trend + Revenue Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Registration Trend */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Patient Registrations</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.patientTrend || []}>
                                <defs>
                                    <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={8} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-8} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="patients" name="Patients" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#patientGrad)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Revenue Trend</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.revenueTrend || []} barSize={32}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={8} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-8} tickFormatter={v => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="revenue" name="Revenue" fill="url(#revenueGrad)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Appointments Trend + Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Appointments Trend */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Appointments</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.appointmentTrend || []}>
                                <defs>
                                    <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={8} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-8} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#apptGrad)" dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Appointment Status Distribution */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-slate-900">Appointment Status</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Last 30 days</p>
                    </div>
                    {analytics?.appointmentsByStatus?.length > 0 ? (
                        <div className="h-[250px] flex flex-col items-center">
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie data={analytics.appointmentsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={2} stroke="#fff">
                                        {analytics.appointmentsByStatus.map((_, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-3 mt-2">
                                {analytics.appointmentsByStatus.map((item, i) => (
                                    <div key={item.status} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></div>
                                        <span className="text-xs text-slate-600">{item.status} ({item.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">No appointment data</div>
                    )}
                </div>

                {/* Users by Role */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-slate-900">Users by Role</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Active accounts</p>
                    </div>
                    {analytics?.usersByRole?.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.usersByRole.map((item, i) => {
                                const maxCount = Math.max(...analytics.usersByRole.map(r => r.count));
                                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                                return (
                                    <div key={item.role} className="group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{item.role}</span>
                                            <span className="text-sm font-bold text-slate-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700 ease-out"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length]
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">No user data</div>
                    )}
                </div>
            </div>

            {/* Recent Activity + System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-900 mb-5">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
                        ) : (
                            recentActivity.slice(0, 8).map((activity, idx) => (
                                <div key={activity.id || idx} className="flex gap-3 items-start">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ring-4 ring-white shrink-0 ${getActivityColor(activity.action)}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 font-medium truncate">{activity.action || 'Action'}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-slate-500 truncate">{activity.username || `User #${activity.performed_by}`}</span>
                                            <span className="text-xs text-slate-300">•</span>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">{formatTimeAgo(activity.timestamp)}</span>
                                        </div>
                                        {activity.details && <p className="text-xs text-slate-400 mt-0.5 truncate">{activity.details}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">System Status</h4>
                            <p className="text-slate-400 text-sm">All services operational</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Active Users</span>
                            <span className="font-mono text-emerald-400 font-medium">{stats?.activeUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Beds Free</span>
                            <span className="font-mono text-blue-400 font-medium">
                                {stats?.totalBeds ? `${stats.totalBeds - stats.occupiedBeds} / ${stats.totalBeds}` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Revenue Today</span>
                            <span className="font-mono text-slate-200 font-medium">₹{Number(stats?.todayRevenue || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Total Doctors</span>
                            <span className="font-mono text-purple-400 font-medium">{stats?.activeDoctors || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
