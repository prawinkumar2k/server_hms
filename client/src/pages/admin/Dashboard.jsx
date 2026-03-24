import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Activity, ShieldCheck, Calendar,
    DollarSign, Clock, Search, X,
    Bed, UserCheck, RefreshCw, TrendingUp,
    HeartPulse, Globe, Zap
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isChartReady, setIsChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsChartReady(true), 500);
        return () => clearTimeout(timer);
    }, []);

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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-white/20">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    {payload.map((entry, i) => (
                        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
                            {entry.name}: {typeof entry.value === 'number' && entry.name === 'Revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const statCards = stats ? [
        { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: Users, color: 'text-blue-500', shadow: 'shadow-blue-500/10' },
        { label: "Today's Appointments", value: stats.todayAppointments.toLocaleString(), icon: Calendar, color: 'text-emerald-500', shadow: 'shadow-emerald-500/10' },
        { label: 'Active Doctors', value: stats.activeDoctors.toLocaleString(), icon: Activity, color: 'text-indigo-500', shadow: 'shadow-indigo-500/10' },
        { label: "Today's Revenue", value: `₹${Number(stats.todayRevenue).toLocaleString()}`, icon: DollarSign, color: 'text-amber-500', shadow: 'shadow-amber-500/10' },
        { label: 'Cloud Status', value: 'Secure Node', icon: Globe, color: 'text-cyan-500', shadow: 'shadow-cyan-500/10' },
        { label: 'System Load', value: '4% (Clean)', icon: Zap, color: 'text-violet-500', shadow: 'shadow-violet-500/10' },
    ] : [];

    const getActivityColor = (action) => {
        if (!action) return 'bg-slate-400';
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return 'bg-indigo-500 shadow-indigo-500/50';
        if (a.includes('CREATE') || a.includes('INSERT')) return 'bg-emerald-500 shadow-emerald-500/50';
        if (a.includes('UPDATE') || a.includes('EDIT')) return 'bg-amber-500 shadow-amber-500/50';
        if (a.includes('DELETE')) return 'bg-rose-500 shadow-rose-500/50';
        return 'bg-violet-500 shadow-violet-500/50';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50/50">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <RefreshCw className="w-10 h-10 text-indigo-600 shadow-indigo-600/20" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto px-4 py-8 bg-slate-50/10 min-h-screen">

            {/* Premium Header */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">HMS <span className="text-indigo-600 italic">Clinical</span> Dashboard</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100 shadow-sm">
                            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,1)]"></motion.div>
                            Clinical Vital
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Synced with Secure Cloud</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={fetchDashboardData} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 text-xs flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-indigo-500" />
                        REFRESH SYSTEM
                    </motion.button>
                </div>
            </motion.div>

            {/* Industrial Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {statCards.map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`relative group bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl ${stat.shadow} cursor-default overflow-hidden`}>
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-slate-100/50 transition-all duration-500"></div>
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                                </div>
                                <div className={`p-4 rounded-2xl bg-white shadow-xl border border-slate-50 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Core Analytics Suite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue & Growth */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Patient Trajectory</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Clinical Intelligence Suite</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-indigo-500 opacity-20" />
                    </div>
                    <div className="h-[320px]">
                        {isChartReady && (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={300} aspect={1.6}>
                                <AreaChart data={analytics?.patientTrend || []}>
                                    <defs>
                                        <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.15} />
                                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                    <XAxis dataKey="day" stroke="#cbd5e1" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#cbd5e1" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4f46e5', strokeWidth: 1 }} />
                                    <Area type="monotone" dataKey="patients" name="Patients" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#premiumGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Economic Flux */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight text-right w-full">Revenue Flux</h3>
                        <div className="pl-4 border-l-4 border-emerald-500 ml-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</p>
                            <p className="text-emerald-500 leading-none font-black text-lg">+14%</p>
                        </div>
                    </div>
                    <div className="h-[320px]">
                        {isChartReady && (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={300} aspect={1.3}>
                                <BarChart data={analytics?.revenueTrend || []} barGap={0}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                    <XAxis dataKey="day" stroke="#cbd5e1" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#cbd5e1" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* System Log & Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 shadow-3xl text-white relative shadow-indigo-600/10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Clinical Event Log</h3>
                            <p className="text-slate-400 text-sm font-medium">Real-time server synchronization</p>
                        </div>
                        <div className="flex gap-2">
                           {[1,2,3].map(d => <div key={d} className="w-2 h-2 rounded-full bg-slate-700"></div>)}
                        </div>
                    </div>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {recentActivity.map((activity, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex gap-6 items-center border-b border-slate-800/50 pb-6 group cursor-default last:border-0">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-16">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <div className={`w-3 h-3 rounded-full shrink-0 shadow-lg ${getActivityColor(activity.action)}`}></div>
                                <div className="flex-1">
                                    <p className="text-slate-200 text-sm font-bold group-hover:text-white transition-colors uppercase tracking-wide">{activity.action}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{activity.details} <span className="text-slate-600 ml-2">by {activity.username}</span></p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-indigo-600/30">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-all group-hover:bg-white/20 duration-500"></div>
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <HeartPulse className="w-12 h-12 text-white animate-pulse" />
                            <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest uppercase">Live Link</div>
                        </div>
                        <h4 className="text-3xl font-black tracking-tighter mb-2">Hospital Vital</h4>
                        <p className="text-indigo-100/70 text-sm leading-relaxed font-medium">Monitoring the clinical bridge to our hospital servers in real-time.</p>
                    </div>
                    <div className="space-y-4 font-mono font-bold mt-10">
                        <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm tracking-tighter">
                            <span className="text-white/40 uppercase text-[10px]">VPS LATENCY</span>
                            <span className="text-emerald-300">12ms</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm tracking-tighter">
                            <span className="text-white/40 uppercase text-[10px]">UPTIME</span>
                            <span>99.9%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 text-sm tracking-tighter">
                            <span className="text-white/40 uppercase text-[10px]">CPU</span>
                            <span className="px-2 py-0.5 bg-white/10 rounded">3.2%</span>
                        </div>
                    </div>
                    <button className="w-full mt-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:bg-slate-50 hover:shadow-white/20 active:scale-95">Open Live Monitor</button>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
