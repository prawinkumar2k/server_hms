import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Package, Clock, CheckCircle, XCircle, Truck, RefreshCw } from 'lucide-react';
import axios from 'axios';
import API from '../../config';

const WardIndent = () => {
    const navigate = useNavigate();
    const [indents, setIndents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ ward: '', product_code: '', product_name: '', requested_qty: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchIndents = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/nurse/ward-indents`, { headers });
            setIndents(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchIndents(); }, [fetchIndents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.ward || !form.product_name || !form.requested_qty) return alert('Please fill all fields');
        setSubmitting(true);
        try {
            await axios.post(`${API}/nurse/ward-indent`, form, { headers });
            setShowForm(false);
            setForm({ ward: '', product_code: '', product_name: '', requested_qty: '' });
            fetchIndents();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
        finally { setSubmitting(false); }
    };

    const getStatusIcon = (status) => {
        const map = {
            Pending: <Clock className="h-4 w-4 text-amber-500" />,
            Approved: <CheckCircle className="h-4 w-4 text-blue-500" />,
            Issued: <Truck className="h-4 w-4 text-emerald-500" />,
            Rejected: <XCircle className="h-4 w-4 text-red-500" />
        };
        return map[status] || null;
    };

    const getStatusColor = (status) => {
        const map = {
            Pending: 'bg-amber-100 text-amber-700 border-amber-200',
            Approved: 'bg-blue-100 text-blue-700 border-blue-200',
            Issued: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            Rejected: 'bg-red-100 text-red-700 border-red-200'
        };
        return map[status] || 'bg-slate-100 text-slate-700';
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/nurse/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Ward Indent Requests</h1>
                        <p className="text-sm text-slate-500">Request supplies from central inventory</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchIndents} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                        <RefreshCw className="h-4 w-4 text-slate-600" />
                    </button>
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        <Plus className="h-4 w-4" /> New Indent
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Ward Indent</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Ward</label>
                            <input type="text" placeholder="e.g. General Ward A" value={form.ward} onChange={e => setForm(p => ({ ...p, ward: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Product Code</label>
                            <input type="text" placeholder="e.g. MED001" value={form.product_code} onChange={e => setForm(p => ({ ...p, product_code: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Product Name</label>
                            <input type="text" placeholder="e.g. Saline 500ml" value={form.product_name} onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
                            <input type="number" placeholder="10" value={form.requested_qty} onChange={e => setForm(p => ({ ...p, requested_qty: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
                            <button type="submit" disabled={submitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-md">
                                {submitting ? 'Creating...' : 'Submit Indent'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Ward</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Product</th>
                                <th className="text-center px-5 py-3 font-medium text-slate-600">Qty</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Requested By</th>
                                <th className="text-left px-5 py-3 font-medium text-slate-600">Date</th>
                                <th className="text-center px-5 py-3 font-medium text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {indents.map(i => (
                                <tr key={i.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-900">{i.ward}</td>
                                    <td className="px-5 py-3">
                                        <div>
                                            <p className="text-slate-900">{i.product_name}</p>
                                            <p className="text-xs text-slate-400">{i.product_code}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center font-medium">{i.requested_qty}</td>
                                    <td className="px-5 py-3 text-slate-600">{i.requested_by_name || '-'}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{new Date(i.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(i.status)}`}>
                                            {getStatusIcon(i.status)} {i.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {indents.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No indent requests</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WardIndent;
