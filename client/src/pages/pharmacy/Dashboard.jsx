import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, MoreHorizontal, Users,
    ShoppingBag, Layers, Box,
    TrendingUp, TrendingDown, ChevronDown,
    FileText, CheckCircle, Clock, XCircle
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

// --- Static / Fallback Data ---
const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 500 }, { value: 280 }, { value: 590 }, { value: 320 }, { value: 450 }
];

import { useAuth } from '../../context/AuthContext';

const PharmacyDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user role
    const [stats, setStats] = useState({
        metrics: { salesCount: 0, revenue: 0, customers: 0, expense: 0 },
        inventory: { total: 0, lowStock: 0, categories: 0, totalOrders: 0 },
        totalSales: 0,
        transactions: [],
        chartData: [],
        newCustomers: []
    });
    const [alerts, setAlerts] = useState([]); // Stock Alerts
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [txnFilter, setTxnFilter] = useState('All');
    const [dateRangeOpen, setDateRangeOpen] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState('Today');

    useEffect(() => {
        fetchStats();
        if (user?.role === 'PHARMA_MASTER') {
            fetchAlerts();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/pharmacy/stats');
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAlerts = async () => {
        try {
            const res = await fetch('/api/pharmacy/alerts?status=ACTIVE');
            if (res.ok) {
                const data = await res.json();
                setAlerts(data);
            }
        } catch (e) {
            console.error("Failed to fetch stock alerts", e);
        }
    };

    const handleAcknowledge = async (id) => {
        try {
            const res = await fetch(`/api/pharmacy/alerts/${id}/acknowledge`, { method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (res.ok) {
                setAlerts(prev => prev.filter(a => a.id !== id));
            }
        } catch (e) {
            console.error("Failed to acknowledge alert", e);
        }
    };

    // Filter Logic
    const filteredTransactions = (stats.transactions || []).filter(t => {
        if (txnFilter === 'All') return true;
        if (txnFilter === 'Paid') return t.status === 'Paid';
        if (txnFilter === 'Pending') return t.status === 'Due' || t.status === 'Pending';
        return true;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    // --- Components ---
    const StatCard = ({ title, value, change, changeType, color, isCurrency = false }) => (
        <Card className="hover:shadow-md transition-shadow border-none shadow-sm h-full">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col justify-between h-full min-h-[100px]">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {isCurrency ? formatCurrency(value) : value}
                            </h3>
                        </div>
                        <div className="flex items-center mt-2 text-xs font-medium">
                            <span className={`flex items-center ${changeType === 'down' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {changeType === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                                {change || '0%'}
                            </span>
                            <span className="text-slate-400 ml-1">vs. last week</span>
                        </div>
                    </div>
                    <div className="h-16 w-28">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;

    const getAvatar = (name) => {
        const initials = name ? name.substring(0, 2).toUpperCase() : '??';
        const colors = ['bg-blue-100 text-blue-600', 'bg-pink-100 text-pink-600', 'bg-yellow-100 text-yellow-600', 'bg-green-100 text-green-600'];
        const color = colors[name ? name.length % colors.length : 0];
        return { initials, color };
    };

    return (
        <PageTransition>
            <div className="space-y-6 pb-10" onClick={() => setDateRangeOpen(false)}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 text-sm">Welcome to DashLite Pharmacy Dashboard.</p>
                    </div>
                    {/* ... (Date Range Picker & Report Button - Keep as is) ... */}
                    <div className="flex gap-3 relative">
                        <div className="relative">
                            <Button
                                variant="outline"
                                className="text-slate-600 bg-white border-slate-200 w-40 justify-between"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDateRangeOpen(!dateRangeOpen);
                                }}
                            >
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {selectedDateRange}
                                </span>
                                <ChevronDown className={`w-4 h-4 ml-2 opacity-50 transition-transform ${dateRangeOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {dateRangeOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                                    {['Today', 'Last 7 Days', 'Last 30 Days'].map((range) => (
                                        <button
                                            key={range}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            onClick={() => setSelectedDateRange(range)}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow active:scale-95 transition-all"
                            onClick={() => navigate('/pharmacy-billing/reports/daily')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Reports
                        </Button>
                    </div>
                </div>

                {/* STOCK ALERTS (PHARMA MASTER ONLY) */}
                {user?.role === 'PHARMA_MASTER' && alerts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-red-900">Critical Stock Alerts</h2>
                                <p className="text-sm text-red-600">Action required immediately.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {alerts.map(alert => (
                                <div key={alert.id} className="bg-white p-4 rounded-lg shadow-sm border border-red-100 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{alert.ProductName}</h4>
                                        <p className="text-xs text-slate-500">
                                            Current: <span className="font-bold text-red-600">{alert.current_stock}</span> / Min: {alert.threshold}
                                        </p>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 inline-block ${alert.alert_type === 'OUT_OF_STOCK' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
                                            {alert.alert_type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => navigate(`/pharma-master/orders/create?pcode=${alert.product_pcode}`)}>
                                            Order Stock
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleAcknowledge(alert.id)}>
                                            Acknowledge
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* 1. Today's Sales (Count) */}
                    <StatCard
                        title="Today's Sales"
                        value={stats.metrics.salesCount}
                        change="4.6%"
                        changeType="up"
                        color="#6366f1"
                        isCurrency={false}
                    />
                    {/* 2. Today's Revenue (₹) */}
                    <StatCard
                        title="Today's Revenue"
                        value={stats.metrics.revenue}
                        change="2.3%"
                        changeType="up"
                        color="#8b5cf6"
                        isCurrency={true}
                    />
                    {/* 3. Today's Customers (Count) */}
                    <StatCard
                        title="Today's Customer"
                        value={stats.metrics.customers}
                        change="1.2%"
                        changeType="up"
                        color="#f97316"
                        isCurrency={false}
                    />
                    {/* 4. Today's Expense (₹ - Hardcoded 0) */}
                    <StatCard
                        title="Today's Expense"
                        value={stats.metrics.expense}
                        change="0%"
                        changeType="down"
                        color="#ec4899"
                        isCurrency={true}
                    />
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Total Sales (Lifetime) */}
                    <div className="lg:col-span-4">
                        <Card className="bg-[#1e293b] text-white border-none shadow-lg h-full overflow-hidden relative group cursor-pointer" onClick={() => navigate('/pharmacy-billing/reports/daily')}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e293b] to-[#334155] opacity-50"></div>
                            <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100 opacity-90">Total Sales</h3>
                                        <h2 className="text-3xl font-bold mt-2 tracking-tight">
                                            {formatCurrency(stats.totalSales)}
                                        </h2>
                                        <p className="text-slate-400 text-sm mt-1">Lifetime Sales</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20">
                                        View Report
                                    </Button>
                                </div>

                                <div className="mt-8">
                                    <p className="text-sm text-slate-400 mb-1">Recent Trend</p>
                                    <div className="flex items-end justify-between">
                                        <h4 className="text-xl font-bold">
                                            {stats.chartData.length > 0 ? formatCurrency(stats.chartData[0].value) : formatCurrency(0)}
                                        </h4>
                                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            Active
                                        </div>
                                    </div>
                                </div>

                                {/* Area Chart */}
                                <div className="absolute -bottom-4 -left-4 -right-4 h-32 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.chartData.length > 0 ? stats.chartData : [{ value: 0 }, { value: 0 }]}>
                                            <Area type="monotone" dataKey="value" stroke="#fff" fill="#fff" fillOpacity={0.6} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sales Trend (7 Days) */}
                    <div className="lg:col-span-5">
                        <Card className="h-full border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-bold text-slate-800">Sales Trend (7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full mt-4">
                                    {stats.chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={stats.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10}
                                                    tickFormatter={(str) => {
                                                        const d = new Date(str);
                                                        return isNaN(d.getTime()) ? str : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                                                    }}
                                                />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                    tickFormatter={(val) => `₹${val}`}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [`₹${value}`, 'Sales']}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No sales data in last 7 days</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Store Statistics */}
                    <div className="lg:col-span-3">
                        <Card className="h-full border-none shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-bold text-slate-800">Store Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { label: 'Orders (Total)', value: stats.inventory.totalOrders, icon: ShoppingBag, color: 'bg-indigo-100 text-indigo-600', link: '/pharmacy-billing/billing' },
                                    { label: 'Low Stock', value: stats.inventory.lowStock, icon: Users, color: 'bg-rose-100 text-rose-600', link: '/pharmacy/stock-entry' },
                                    { label: 'Products', value: stats.inventory.total, icon: Box, color: 'bg-pink-100 text-pink-600', link: '/pharmacy/stock-entry' },
                                    { label: 'Categories', value: stats.inventory.categories, icon: Layers, color: 'bg-purple-100 text-purple-600', link: '/pharmacy/stock-entry' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(item.link)}>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium mb-1">{item.label}</p>
                                            <h4 className="text-lg font-bold text-slate-700">{item.value}</h4>
                                        </div>
                                        <div className={`p-3 rounded-xl ${item.color} group-hover:bg-opacity-80 transition-all shadow-sm group-hover:shadow`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Customers */}
                    <div className="lg:col-span-1">
                        <Card className="h-full border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-bold text-slate-800">Recent Customers</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-indigo-600 text-xs font-semibold hover:bg-indigo-50"
                                    onClick={() => navigate('/pharmacy/patient-details')}
                                >
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    {(stats.newCustomers || []).map((customer, idx) => {
                                        const { initials, color } = getAvatar(customer.CusName);
                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                                                onClick={() => navigate(`/pharmacy/patient-details?search=${customer.MobileNo}`)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${color}`}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{customer.CusName || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-400">{customer.MobileNo}</p>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {formatDate(customer.lastVisit)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!stats.newCustomers || stats.newCustomers.length === 0) && <p className="text-slate-400 text-sm italic">No recent customers.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-2">
                        <Card className="h-full border-none shadow-sm">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-50 gap-4">
                                <div className="flex items-center gap-6">
                                    <CardTitle className="text-base font-bold text-slate-800">Transaction</CardTitle>
                                    <div className="flex gap-1 bg-slate-100/50 p-1 rounded-lg">
                                        {['Paid', 'Pending', 'All'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setTxnFilter(tab)}
                                                className={`
                                                    px-3 py-1.5 text-xs font-semibold rounded-md transition-all
                                                    ${txnFilter === tab
                                                        ? 'bg-white text-indigo-600 shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                                    }
                                                `}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-indigo-600 text-xs font-semibold hover:bg-indigo-50"
                                    onClick={() => navigate('/pharmacy-billing/billing')}
                                >
                                    See History
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Invoice No</th>
                                                <th className="px-6 py-3 font-medium">Customer</th>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                                <th className="px-6 py-3 font-medium">Amount</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredTransactions.map((t, idx) => {
                                                const { initials, color } = getAvatar(t.customer);
                                                return (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-slate-50/50 transition-colors group cursor-default"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-indigo-600 cursor-pointer hover:underline" onClick={() => navigate('/pharmacy-billing/billing')}>{t.id}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
                                                                    {initials}
                                                                </div>
                                                                <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{t.customer}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500">{formatDate(t.date)}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(t.amount)}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${t.status === 'Paid'
                                                                ? 'bg-emerald-100 text-emerald-600'
                                                                : 'bg-yellow-100 text-yellow-600'
                                                                }`}>
                                                                {t.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white text-slate-400 hover:text-indigo-600">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredTransactions.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                                                        <div className="flex flex-col items-center justify-center text-slate-300">
                                                            <XCircle className="w-8 h-8 mb-2" />
                                                            <p>No transactions found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PharmacyDashboard;
