import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pill, FlaskConical, Utensils, Syringe, Stethoscope, XCircle, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import API from '../../config';

const DoctorOrders = () => {
    const { admissionId } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        order_type: 'Medication', item_name: '', dosage: '', frequency: '', instructions: '', meal_timing: []
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/ipd-rounds/orders/${admissionId}`, { headers });
            setOrders(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [admissionId]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.item_name) return alert('Item name is required');
        setSubmitting(true);
        try {
            const payload = { admission_id: parseInt(admissionId), ...form };
            // For Diet orders, send meal_timing; clear dosage/frequency
            if (form.order_type === 'Diet') {
                payload.dosage = '';
                payload.frequency = '';
            } else {
                delete payload.meal_timing;
            }
            await axios.post(`${API}/ipd-rounds/orders`, payload, { headers });
            setShowForm(false);
            setForm({ order_type: 'Medication', item_name: '', dosage: '', frequency: '', instructions: '', meal_timing: [] });
            fetchOrders();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
        finally { setSubmitting(false); }
    };

    const handleCancel = async (orderId) => {
        if (!confirm('Cancel this order?')) return;
        try {
            await axios.put(`${API}/ipd-rounds/orders/${orderId}/cancel`, {}, { headers });
            fetchOrders();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const orderTypeConfig = {
        Medication: { icon: Pill, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-100 text-violet-700' },
        Consumable: { icon: Syringe, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-100 text-teal-700' },
        Procedure: { icon: Stethoscope, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-100 text-blue-700' },
        Lab: { icon: FlaskConical, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100 text-amber-700' },
        Diet: { icon: Utensils, color: 'from-green-500 to-emerald-500', bg: 'bg-green-100 text-green-700' }
    };

    const statusColors = {
        Pending: 'bg-amber-100 text-amber-700 border-amber-200',
        Acknowledged: 'bg-blue-100 text-blue-700 border-blue-200',
        Administered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Completed: 'bg-green-100 text-green-700 border-green-200',
        Cancelled: 'bg-red-100 text-red-700 border-red-200'
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/doctor/ipd-patients')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Doctor Orders</h1>
                        <p className="text-sm text-slate-500">Medications, procedures, labs, diet — Admission #{admissionId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchOrders} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200"><RefreshCw className="h-4 w-4 text-slate-600" /></button>
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">
                        <Plus className="h-4 w-4" /> New Order
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Order</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Order Type Selection */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">Order Type</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(orderTypeConfig).map(([type, cfg]) => (
                                    <button key={type} type="button"
                                        onClick={() => setForm(p => ({
                                            ...p,
                                            order_type: type,
                                            meal_timing: type === 'Diet' ? [] : [],
                                            dosage: type === 'Diet' ? '' : p.dosage,
                                            frequency: type === 'Diet' ? '' : p.frequency
                                        }))}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${form.order_type === type
                                            ? `bg-gradient-to-r ${cfg.color} text-white border-transparent shadow-lg`
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <cfg.icon className="h-4 w-4" /> {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className={form.order_type === 'Diet' ? 'sm:col-span-2 lg:col-span-2' : 'sm:col-span-2'}>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Item Name *</label>
                                <input type="text" placeholder={form.order_type === 'Diet' ? 'e.g. Diabetic Diet, Liquid Diet' : 'e.g. Paracetamol 500mg'} value={form.item_name} onChange={e => setForm(p => ({ ...p, item_name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            {form.order_type === 'Diet' ? (
                                /* Meal Timing selection for Diet orders */
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-slate-600 mb-2">Meal Timing *</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Breakfast', 'Lunch', 'Dinner'].map(meal => {
                                            const isSelected = form.meal_timing.includes(meal);
                                            return (
                                                <button key={meal} type="button"
                                                    onClick={() => setForm(p => ({
                                                        ...p,
                                                        meal_timing: isSelected
                                                            ? p.meal_timing.filter(m => m !== meal)
                                                            : [...p.meal_timing, meal]
                                                    }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${isSelected
                                                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-600'
                                                        }`}
                                                >
                                                    {meal}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                /* Dosage & Frequency for non-Diet orders */
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Dosage</label>
                                        <input type="text" placeholder="e.g. 500mg, 1 tablet" value={form.dosage} onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Frequency</label>
                                        <input type="text" placeholder="e.g. TID, BD, Once" value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Instructions</label>
                            <textarea placeholder="Special instructions..." value={form.instructions} onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))} rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                        </div>

                        {form.order_type === 'Diet' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                                <Utensils className="h-4 w-4 inline mr-2" />
                                Diet orders are automatically pushed to the Pantry module for selected meal timings today.
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
                            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-colors">
                                {submitting ? 'Creating...' : 'Create Order'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Orders List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Type</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Item</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Dosage</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Frequency</th>
                                <th className="text-center px-5 py-3 font-medium text-slate-600">Status</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Time</th>
                                <th className="text-center px-5 py-3 font-medium text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(o => {
                                const cfg = orderTypeConfig[o.order_type] || orderTypeConfig.Medication;
                                return (
                                    <tr key={o.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                                                <cfg.icon className="h-3 w-3" /> {o.order_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-medium text-slate-900">{o.item_name}</td>
                                        <td className="px-5 py-3 text-slate-600">{o.order_type === 'Diet' ? '-' : (o.dosage || '-')}</td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {o.order_type === 'Diet'
                                                ? (o.frequency
                                                    ? o.frequency.split(',').map(m => (
                                                        <span key={m} className="inline-block mr-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                            {m.trim()}
                                                        </span>
                                                    ))
                                                    : '-')
                                                : (o.frequency || '-')}
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[o.status]}`}>{o.status}</span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {new Date(o.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            {o.status === 'Pending' && (
                                                <button onClick={() => handleCancel(o.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No orders placed yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorOrders;
