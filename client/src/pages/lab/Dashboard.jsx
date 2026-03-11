import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, AlertTriangle, Package, Activity, FileText,
    TrendingUp, Plus, Clock, Users, Search, Bell, ChevronRight,
    CheckCircle, MoreHorizontal, ArrowUpRight, FlaskConical, Truck,
    Filter, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import PageTransition from '../../components/layout/PageTransition';
import { useAuth } from '../../context/AuthContext';

const LabDashboard = () => {
    // Updated: Light theme for Items in Stock card
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Data States
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        pendingIndents: 0,
        totalTests: 0,
        recentIndents: [],
        lowStockItems: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [productsRes, indentsRes, testsRes] = await Promise.all([
                    fetch('/api/inventory/products'),
                    fetch('/api/inventory/indents'),
                    fetch('/api/tests')
                ]);

                const products = await productsRes.json();
                const indents = await indentsRes.json();
                const tests = await testsRes.json();

                const pList = Array.isArray(products) ? products : [];
                const iList = Array.isArray(indents) ? indents : [];
                const tList = Array.isArray(tests) ? tests : [];

                // Calculate Low Stock
                const lowStock = pList.filter(p => {
                    const stock = parseInt(p.Stock || 0);
                    const reOrder = parseInt(p.ReOrder || 0);
                    return stock <= reOrder;
                });

                setStats({
                    totalProducts: pList.length,
                    lowStockCount: lowStock.length,
                    pendingIndents: iList.length,
                    totalTests: tList.length,
                    recentIndents: iList, // Keep all for grid
                    lowStockItems: lowStock
                });
                setLoading(false);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Metric Cards Configuration
    const metrics = [
        { label: "Total Tests", value: stats.totalTests, change: "Active", icon: FlaskConical, color: "text-emerald-600 bg-emerald-50", ring: "ring-emerald-100", path: "/lab-master/test-master" },
        { label: "Low Stock", value: stats.lowStockCount, change: "Alert", icon: AlertTriangle, color: "text-red-600 bg-red-50", ring: "ring-red-100", path: "/lab/products" },
        { label: "Indents", value: stats.pendingIndents, change: "Pending", icon: Truck, color: "text-orange-600 bg-orange-50", ring: "ring-orange-100", path: "/lab/indents" },
    ];

    // Grid Definitions
    const indentCols = useMemo(() => [
        {
            field: 'pname',
            headerName: 'Product',
            flex: 1.5,
            cellClass: 'font-medium text-slate-700 flex items-center',
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {params.value ? params.value.charAt(0) : '?'}
                    </div>
                    <span>{params.value}</span>
                </div>
            )
        },
        { field: 'requireQty', headerName: 'Qty', flex: 0.8, type: 'alignedRight', cellClass: 'font-bold text-slate-600' },
        {
            field: 'indentDate',
            headerName: 'Date',
            flex: 1,
            cellClass: 'text-slate-400 text-xs',
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '-'
        },
    ], []);

    const lowStockCols = useMemo(() => [
        { field: 'ProductName', headerName: 'Item', flex: 1.5, cellClass: 'font-medium text-slate-800' },
        {
            field: 'Stock',
            headerName: 'Stock',
            flex: 0.8,
            cellClass: 'text-red-600 font-bold bg-red-50 rounded-md px-2 py-0.5 inline-block text-center mx-auto my-1 h-fit w-fit',
            type: 'alignedCenter'
        },
        { field: 'ReOrder', headerName: 'Min', flex: 0.6, type: 'alignedCenter', cellClass: 'text-slate-400' },
    ], []);

    if (loading) return <div className="p-10 flex justify-center text-slate-500">Loading Dashboard...</div>;

    return (
        <PageTransition>
            {/* Main Container - Fixed Height with clear padding bottom for pagination */}
            <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col overflow-hidden bg-slate-50/50 p-4 rounded-3xl">

                {/* Header Section */}
                <div className="flex-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Dashboard</h1>
                        <p className="text-slate-500">Welcome, <span className="font-semibold text-slate-900">{user?.name || 'Technician'}</span> • Updated 20:10</p>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72 group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 shadow-sm transition-all"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="relative text-slate-500 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 rounded-xl">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 pb-2">

                    {/* Left Column: Stats (3 Cols) */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 h-full overflow-y-auto pr-1">
                        {/* Hero Stats Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Package className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/20">Active</span>
                                </div>
                                <div className="space-y-1 mb-6">
                                    <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">{stats.totalProducts}</h3>
                                    <p className="text-sm text-slate-400 font-medium">Items in Stock</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Valuation</p>
                                        <p className="text-sm font-semibold text-white">₹ 12.5L</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Utilization</p>
                                        <p className="text-sm font-semibold text-emerald-400">94%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metric Widgets */}
                        {metrics.map((stat, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(stat.path)}
                                className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer"
                            >
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-bold text-slate-800">{stat.value}</h4>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${stat.color.replace('text-', 'bg-').replace('bg-', 'text-opacity-20 text-')}`}>{stat.change}</span>
                                    </div>
                                </div>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color} ${stat.ring} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Middle Column: Indents Grid (5 Cols) */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col">
                        <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Recent Indents</h3>
                                        <p className="text-xs text-slate-500">Requests pending approval</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg" onClick={() => navigate('/lab/indents')}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex-1 min-h-0 bg-slate-50/20 relative p-0 overflow-y-auto custom-scrollbar">
                                <div className="divide-y divide-slate-100">
                                    {stats.recentIndents.length > 0 ? (
                                        stats.recentIndents.map((indent, idx) => (
                                            <div
                                                key={indent.indentID || idx}
                                                onClick={() => navigate('/lab/indents')}
                                                className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 font-bold text-sm group-hover:border-orange-200 group-hover:text-orange-600 transition-colors">
                                                        {(indent.pname || '?').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">{indent.pname}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                                                {indent.pCode || 'N/A'}
                                                            </span>
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {indent.indentDate ? new Date(indent.indentDate).toLocaleDateString() : 'Date N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-slate-900">{indent.requireQty}</div>
                                                    <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Pending</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 text-sm">No recent indents found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Alerts & Actions (4 Cols) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 h-full">

                        {/* Quick Actions (Tiles) */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Stock Entry", icon: Package, color: "text-blue-600", bg: "bg-blue-50/50", hover: "hover:bg-blue-50 hover:border-blue-200", path: "/lab/products" },
                                { label: "Raise Indent", icon: FileText, color: "text-orange-600", bg: "bg-orange-50/50", hover: "hover:bg-orange-50 hover:border-orange-200", path: "/lab/indents" },
                                { label: "Issue Items", icon: Activity, color: "text-purple-600", bg: "bg-purple-50/50", hover: "hover:bg-purple-50 hover:border-purple-200", path: "/lab/issues" },
                                { label: "Lab Tests", icon: FlaskConical, color: "text-emerald-600", bg: "bg-emerald-50/50", hover: "hover:bg-emerald-50 hover:border-emerald-200", path: "/lab-master/test-master" },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    className={`relative p-4 rounded-xl border border-slate-100 ${action.bg} ${action.hover} transition-all duration-200 flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-sm`}
                                >
                                    <div className={`p-2 rounded-full bg-white shadow-sm ${action.color} group-hover:scale-110 transition-transform`}>
                                        <action.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{action.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Critical Stock Card - List View */}
                        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-red-100 flex flex-col overflow-hidden relative group">
                            <div className="px-6 py-4 border-b border-red-50 flex justify-between items-center bg-red-50/30">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span className="absolute top-0 right-0 -mr-0.5 -mt-0.5 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                    </div>
                                    <h3 className="font-bold text-red-900 text-sm">Critical Stock</h3>
                                </div>
                                <span className="bg-white text-red-600 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm border border-red-100">{stats.lowStockCount}</span>
                            </div>
                            <div className="flex-1 min-h-0 relative overflow-y-auto custom-scrollbar p-0">
                                <div className="divide-y divide-red-50/50">
                                    {stats.lowStockItems.length > 0 ? (
                                        stats.lowStockItems.map((item, idx) => (
                                            <div
                                                key={item.Pcode || idx}
                                                onClick={() => navigate('/lab/products')}
                                                className="px-5 py-3 hover:bg-red-50/30 transition-colors cursor-pointer flex items-center justify-between"
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.ProductName}</h4>
                                                    <p className="text-xs text-red-400 font-medium">Re-Order Level: {item.ReOrder}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">{item.Stock}</span>
                                                    <span className="text-[10px] text-slate-400 mt-0.5">{item.Scale || 'Unit'}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 text-sm">Stock levels are healthy.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageTransition>
    );
};

export default LabDashboard;
