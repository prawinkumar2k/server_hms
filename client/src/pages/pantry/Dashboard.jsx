import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, CheckCircle, Clock, ChefHat, RefreshCw, Filter, Truck, Eye } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PantryDashboard = () => {
    const { user } = useAuth();
    const isViewOnly = user?.role === 'Admin';

    const [data, setData] = useState({ orders: [], stats: { total: 0, pending: 0, preparing: 0, delivered: 0 } });
    const [loading, setLoading] = useState(true);
    const [filterMeal, setFilterMeal] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedIds, setSelectedIds] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/pantry/dashboard`, { headers, params: { date: selectedDate } });
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [selectedDate]);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API}/pantry/meals/${id}/status`, { status }, { headers });
            fetchDashboard();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleBulkDeliver = async () => {
        if (selectedIds.length === 0) return alert('Select meals to mark as delivered');
        try {
            await axios.post(`${API}/pantry/meals/bulk-deliver`, { ids: selectedIds }, { headers });
            setSelectedIds([]);
            fetchDashboard();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const filteredOrders = data.orders.filter(o => {
        if (filterMeal !== 'all' && o.meal_time !== filterMeal) return false;
        if (filterStatus !== 'all' && o.status !== filterStatus) return false;
        return true;
    });

    const statusColors = {
        Pending: 'bg-amber-100 text-amber-700 border-amber-200',
        Preparing: 'bg-blue-100 text-blue-700 border-blue-200',
        Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Cancelled: 'bg-red-100 text-red-700 border-red-200'
    };

    const mealColors = {
        Breakfast: 'bg-orange-50 border-orange-200 text-orange-700',
        Lunch: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        Snack: 'bg-pink-50 border-pink-200 text-pink-700',
        Dinner: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Utensils className="h-6 w-6 text-indigo-500" /> Pantry Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Dietary orders & meal fulfillment</p>
                </div>
                <div className="flex items-center gap-3">
                    {isViewOnly && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500">
                            <Eye className="h-3.5 w-3.5" /> View Only
                        </span>
                    )}
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                    <button onClick={fetchDashboard} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm shadow-sm">
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-5 text-white shadow-lg">
                    <p className="text-slate-300 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold mt-1">{data.stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg shadow-amber-200">
                    <p className="text-amber-100 text-sm">Pending</p>
                    <p className="text-3xl font-bold mt-1">{data.stats.pending}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
                    <p className="text-blue-100 text-sm">Preparing</p>
                    <p className="text-3xl font-bold mt-1">{data.stats.preparing}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-5 text-white shadow-lg shadow-emerald-200">
                    <p className="text-emerald-100 text-sm">Delivered</p>
                    <p className="text-3xl font-bold mt-1">{data.stats.delivered}</p>
                </div>
            </div>

            {/* Filters & Bulk Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 px-5 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select value={filterMeal} onChange={e => setFilterMeal(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500">
                        <option value="all">All Meals</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Snack">Snack</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500">
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
                {!isViewOnly && selectedIds.length > 0 && (
                    <button onClick={handleBulkDeliver} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-md transition-colors">
                        <Truck className="h-4 w-4" /> Mark {selectedIds.length} Delivered
                    </button>
                )}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {!isViewOnly && (
                                    <th className="px-4 py-3 w-10">
                                        <input type="checkbox" onChange={e => {
                                            if (e.target.checked) setSelectedIds(filteredOrders.filter(o => o.status !== 'Delivered').map(o => o.id));
                                            else setSelectedIds([]);
                                        }} className="rounded border-slate-300" />
                                    </th>
                                )}
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Patient / Bed</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Ward</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Diet Type</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">Meal</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                                {!isViewOnly && (
                                    <th className="text-center px-4 py-3 font-medium text-slate-600">Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map(o => (
                                <tr key={o.id} className="hover:bg-slate-50">
                                    {!isViewOnly && (
                                        <td className="px-4 py-3">
                                            {o.status !== 'Delivered' && (
                                                <input type="checkbox" checked={selectedIds.includes(o.id)} onChange={() => toggleSelect(o.id)} className="rounded border-slate-300" />
                                            )}
                                        </td>
                                    )}
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-slate-900">{o.patient_name}</p>
                                            <p className="text-xs text-slate-500">Bed: {o.bed_number}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{o.ward}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-900">{o.diet_type}</p>
                                        {o.special_instructions && <p className="text-xs text-slate-400 italic mt-0.5">{o.special_instructions}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${mealColors[o.meal_time] || ''}`}>{o.meal_time}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[o.status]}`}>{o.status}</span>
                                    </td>
                                    {!isViewOnly && (
                                        <td className="px-4 py-3 text-center">
                                            {o.status === 'Pending' && (
                                                <button onClick={() => handleStatusUpdate(o.id, 'Preparing')} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 border border-blue-200">
                                                    Prepare
                                                </button>
                                            )}
                                            {o.status === 'Preparing' && (
                                                <button onClick={() => handleStatusUpdate(o.id, 'Delivered')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 border border-emerald-200">
                                                    Delivered
                                                </button>
                                            )}
                                            {o.status === 'Delivered' && (
                                                <span className="text-emerald-500 text-xs flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3" /> Done</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr><td colSpan={isViewOnly ? 5 : 7} className="px-6 py-12 text-center text-slate-400">No dietary orders for this date</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PantryDashboard;
