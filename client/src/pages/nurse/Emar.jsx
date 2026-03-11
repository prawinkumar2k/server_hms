import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Pill, CheckCircle, Clock, AlertTriangle,
    ClipboardCheck, RefreshCw
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Emar = () => {
    const { admissionId } = useParams();
    const navigate = useNavigate();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [emarHistory, setEmarHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('pending');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = useCallback(async () => {
        try {
            const [pendingRes, historyRes] = await Promise.all([
                axios.get(`${API}/nurse/emar/${admissionId}/pending`, { headers }),
                axios.get(`${API}/nurse/emar/${admissionId}`, { headers })
            ]);
            setPendingOrders(pendingRes.data);
            setEmarHistory(historyRes.data);
        } catch (err) {
            console.error('Failed to fetch eMAR data:', err);
        } finally {
            setLoading(false);
        }
    }, [admissionId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAcknowledge = async (orderId) => {
        try {
            await axios.put(`${API}/nurse/emar/acknowledge/${orderId}`, {}, { headers });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to acknowledge');
        }
    };

    const handleAdminister = async (order) => {
        const notes = prompt('Administration notes (optional):');
        try {
            await axios.post(`${API}/nurse/emar/administer`, {
                order_id: order.id,
                admission_id: parseInt(admissionId),
                notes
            }, { headers });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to administer');
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            Pending: 'bg-amber-100 text-amber-700 border-amber-200',
            Acknowledged: 'bg-blue-100 text-blue-700 border-blue-200',
            Administered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            Completed: 'bg-green-100 text-green-700 border-green-200',
            Cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return map[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getOrderTypeColor = (type) => {
        const map = {
            Medication: 'bg-violet-100 text-violet-700',
            Consumable: 'bg-teal-100 text-teal-700',
            Procedure: 'bg-blue-100 text-blue-700',
            Lab: 'bg-amber-100 text-amber-700',
            Diet: 'bg-green-100 text-green-700'
        };
        return map[type] || 'bg-slate-100 text-slate-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/nurse/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Electronic MAR</h1>
                        <p className="text-sm text-slate-500">Medication Administration Record — Admission #{admissionId}</p>
                    </div>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors shadow-sm">
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Pending Orders ({pendingOrders.length})
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Administration History
                </button>
            </div>

            {/* Pending Orders */}
            {tab === 'pending' && (
                <div className="space-y-3">
                    {pendingOrders.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium">No pending medication orders</p>
                            <p className="text-sm text-slate-400 mt-1">All orders have been administered</p>
                        </div>
                    ) : (
                        pendingOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getOrderTypeColor(order.order_type)}`}>
                                                {order.order_type}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900">{order.item_name}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                            {order.dosage && <span>Dosage: <strong>{order.dosage}</strong></span>}
                                            {order.frequency && <span>Frequency: <strong>{order.frequency}</strong></span>}
                                            {order.ordered_by_name && <span>Ordered by: <strong>Dr. {order.ordered_by_name}</strong></span>}
                                        </div>
                                        {order.instructions && (
                                            <p className="text-sm text-slate-500 italic mt-1">{order.instructions}</p>
                                        )}
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        {order.status === 'Pending' && (
                                            <button
                                                onClick={() => handleAcknowledge(order.id)}
                                                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200 transition-colors"
                                            >
                                                <ClipboardCheck className="h-4 w-4" /> Acknowledge
                                            </button>
                                        )}
                                        {(order.status === 'Pending' || order.status === 'Acknowledged') && (
                                            <button
                                                onClick={() => handleAdminister(order)}
                                                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md"
                                            >
                                                <Pill className="h-4 w-4" /> Administer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* History */}
            {tab === 'history' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Medication</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Type</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Dosage</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Administered By</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Time</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {emarHistory.map(e => (
                                    <tr key={e.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3 font-medium text-slate-900">{e.item_name}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOrderTypeColor(e.order_type)}`}>{e.order_type}</span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{e.dosage || '-'}</td>
                                        <td className="px-5 py-3 text-slate-600">{e.administered_by_name || '-'}</td>
                                        <td className="px-5 py-3 text-xs text-slate-500">{new Date(e.administered_at).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-xs text-slate-500 max-w-[200px] truncate">{e.notes || '-'}</td>
                                    </tr>
                                ))}
                                {emarHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No administration records yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Emar;
