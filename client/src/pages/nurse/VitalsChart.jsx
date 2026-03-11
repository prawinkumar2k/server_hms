import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Heart, Thermometer, Droplets, Wind, Activity,
    ArrowLeft, Plus, Clock, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VitalsChart = () => {
    const { admissionId } = useParams();
    const navigate = useNavigate();
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        bp_systolic: '', bp_diastolic: '', temperature: '',
        pulse: '', spo2: '', sugar_level: '', respiratory_rate: '', notes: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchVitals = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/nurse/vitals/${admissionId}`, { headers });
            setVitals(res.data);
        } catch (err) {
            console.error('Failed to fetch vitals:', err);
        } finally {
            setLoading(false);
        }
    }, [admissionId]);

    useEffect(() => { fetchVitals(); }, [fetchVitals]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API}/nurse/vitals`, {
                admission_id: parseInt(admissionId),
                ...form
            }, { headers });
            setShowForm(false);
            setForm({ bp_systolic: '', bp_diastolic: '', temperature: '', pulse: '', spo2: '', sugar_level: '', respiratory_rate: '', notes: '' });
            fetchVitals();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record vitals');
        } finally {
            setSubmitting(false);
        }
    };

    const latest = vitals[0] || null;

    const vitalCards = latest ? [
        { label: 'Blood Pressure', value: `${latest.bp_systolic || '-'}/${latest.bp_diastolic || '-'}`, unit: 'mmHg', icon: Heart, color: 'from-rose-500 to-red-500', shadow: 'shadow-rose-200' },
        { label: 'Temperature', value: latest.temperature || '-', unit: '°F', icon: Thermometer, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200' },
        { label: 'Pulse', value: latest.pulse || '-', unit: 'bpm', icon: Activity, color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-200' },
        { label: 'SpO2', value: latest.spo2 || '-', unit: '%', icon: Wind, color: 'from-emerald-500 to-green-500', shadow: 'shadow-emerald-200' },
        { label: 'Sugar Level', value: latest.sugar_level || '-', unit: 'mg/dL', icon: Droplets, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-200' },
        { label: 'Respiratory Rate', value: latest.respiratory_rate || '-', unit: '/min', icon: Wind, color: 'from-cyan-500 to-teal-500', shadow: 'shadow-cyan-200' },
    ] : [];

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
                        <h1 className="text-2xl font-bold text-slate-900">Vitals Tracking</h1>
                        <p className="text-sm text-slate-500">Admission #{admissionId}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-lg shadow-indigo-200"
                >
                    <Plus className="h-4 w-4" /> Record Vitals
                </button>
            </div>

            {/* Vitals Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Record New Vitals</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { key: 'bp_systolic', label: 'BP Systolic', placeholder: '120' },
                            { key: 'bp_diastolic', label: 'BP Diastolic', placeholder: '80' },
                            { key: 'temperature', label: 'Temperature (°F)', placeholder: '98.6' },
                            { key: 'pulse', label: 'Pulse (bpm)', placeholder: '72' },
                            { key: 'spo2', label: 'SpO2 (%)', placeholder: '98' },
                            { key: 'sugar_level', label: 'Sugar (mg/dL)', placeholder: '100' },
                            { key: 'respiratory_rate', label: 'Resp. Rate (/min)', placeholder: '18' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        ))}
                        <div className="sm:col-span-2 lg:col-span-4">
                            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                            <textarea
                                placeholder="Clinical notes..."
                                value={form.notes}
                                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows={2}
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
                            <button type="submit" disabled={submitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md">
                                {submitting ? 'Saving...' : 'Save Vitals'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Current Vitals Cards */}
            {latest && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {vitalCards.map((card, i) => (
                        <div key={i} className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white shadow-lg ${card.shadow}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <card.icon className="h-4 w-4 opacity-80" />
                                <span className="text-xs opacity-90">{card.label}</span>
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="text-xs opacity-75 mt-1">{card.unit}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Vitals History Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" /> Vitals History
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Time</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">BP</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">Temp</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">Pulse</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">SpO2</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">Sugar</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">Resp</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">By</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vitals.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-xs">{new Date(v.recorded_at).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium">{v.bp_systolic}/{v.bp_diastolic}</td>
                                    <td className="px-4 py-3 text-center">{v.temperature || '-'}</td>
                                    <td className="px-4 py-3 text-center">{v.pulse || '-'}</td>
                                    <td className="px-4 py-3 text-center">{v.spo2 || '-'}%</td>
                                    <td className="px-4 py-3 text-center">{v.sugar_level || '-'}</td>
                                    <td className="px-4 py-3 text-center">{v.respiratory_rate || '-'}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{v.recorded_by_name || '-'}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate">{v.notes || '-'}</td>
                                </tr>
                            ))}
                            {vitals.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">No vitals recorded yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VitalsChart;
