import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ShoppingCart, Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';
import { useAuth } from '../../context/AuthContext';

const StockOrders = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            // If no token, force logout immediately (should be handled by protected route, but safety first)
            if (!token) {
                logout();
                navigate('/');
                return;
            }

            const res = await fetch('/api/pharmacy/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                logout();
                navigate('/');
                return;
            }

            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-600';
            case 'ORDERED': return 'bg-blue-100 text-blue-600';
            case 'PARTIALLY_RECEIVED': return 'bg-amber-100 text-amber-600';
            case 'RECEIVED': return 'bg-emerald-100 text-emerald-600';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const filteredOrders = orders.filter(o => filter === 'All' || o.order_status === filter);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Stock Orders</h1>
                        <p className="text-slate-500 text-sm">Track and manage medicine procurement.</p>
                    </div>
                    <Button onClick={() => navigate('/pharma-master/orders/create')} className="bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                        <Plus className="w-4 h-4 mr-2" /> Create New Order
                    </Button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setFilter('DRAFT')}>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Drafts</p>
                            <p className="text-2xl font-bold text-slate-800">{orders.filter(o => o.order_status === 'DRAFT').length}</p>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><FileTextIcon /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setFilter('ORDERED')}>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Pending</p>
                            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.order_status === 'ORDERED').length}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Clock className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => setFilter('RECEIVED')}>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Received</p>
                            <p className="text-2xl font-bold text-emerald-600">{orders.filter(o => o.order_status === 'RECEIVED').length}</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors" onClick={() => setFilter('All')}>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Total</p>
                            <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Package className="w-5 h-5" /></div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Order No</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Supplier</th>
                                <th className="px-6 py-3">Created By</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? <tr><td colSpan="7" className="p-6 text-center">Loading...</td></tr> : filteredOrders.map(o => (
                                <tr key={o.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate(`/pharma-master/orders/${o.id}`)}>
                                    <td className="px-6 py-4 font-mono font-medium text-indigo-600 group-hover:underline">{o.order_number}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{o.supplier_name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-500">{o.created_by_name}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">₹{o.total_amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(o.order_status)}`}>
                                            {o.order_status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600">View</Button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredOrders.length === 0 && (
                                <tr><td colSpan="7" className="p-10 text-center text-slate-400">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    );
};

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
);

export default StockOrders;
