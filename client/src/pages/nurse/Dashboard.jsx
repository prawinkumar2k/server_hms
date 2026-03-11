import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Heart, Thermometer, Droplets, Wind,
    Clock, Users, AlertTriangle, BedDouble, ClipboardList,
    ChevronRight, RefreshCw, Package
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NurseDashboard = () => {
    const [data, setData] = useState({ activePatients: [], pendingIndents: 0, totalActive: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashboard = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API}/nurse/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch nurse dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    const getTriageColor = (status) => {
        return status === 'Completed'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-amber-100 text-amber-700 border-amber-200';
    };

    const getTimeSince = (dateStr) => {
        if (!dateStr) return 'No vitals recorded';
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        if (hours > 0) return `${hours}h ${mins}m ago`;
        return `${mins}m ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nurse Station</h1>
                    <p className="text-sm text-slate-500 mt-1">Patient care & medication tracking</p>
                </div>
                <button
                    onClick={fetchDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors shadow-sm"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Active Patients</p>
                            <p className="text-3xl font-bold mt-1">{data.totalActive}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <BedDouble className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg shadow-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm">Pending Triage</p>
                            <p className="text-3xl font-bold mt-1">
                                {data.activePatients.filter(p => p.triage_status === 'Pending').length}
                            </p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl p-5 text-white shadow-lg shadow-rose-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-rose-100 text-sm">Pending Med Orders</p>
                            <p className="text-3xl font-bold mt-1">
                                {data.activePatients.reduce((acc, p) => acc + (p.pending_orders || 0), 0)}
                            </p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white shadow-lg shadow-violet-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-violet-100 text-sm">Pending Indents</p>
                            <p className="text-3xl font-bold mt-1">{data.pendingIndents}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Active IPD Patients</h2>
                    <span className="text-sm text-slate-500">{data.activePatients.length} patients</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-3 font-medium text-slate-600">Patient</th>
                                <th className="text-left px-6 py-3 font-medium text-slate-600">Bed / Ward</th>
                                <th className="text-left px-6 py-3 font-medium text-slate-600">Triage</th>
                                <th className="text-left px-6 py-3 font-medium text-slate-600">Last Vitals</th>
                                <th className="text-left px-6 py-3 font-medium text-slate-600">Pending Orders</th>
                                <th className="text-left px-6 py-3 font-medium text-slate-600">Diet</th>
                                <th className="text-center px-6 py-3 font-medium text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.activePatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900">{patient.patient_name}</p>
                                            <p className="text-xs text-slate-500">ID: {patient.patient_id}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-slate-700">
                                            <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                                            {patient.ward} - {patient.bed_number}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTriageColor(patient.triage_status)}`}>
                                            {patient.triage_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs ${patient.last_vitals_at ? 'text-slate-600' : 'text-red-500 font-medium'}`}>
                                            {getTimeSince(patient.last_vitals_at)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.pending_orders > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                                <AlertTriangle className="h-3 w-3" /> {patient.pending_orders}
                                            </span>
                                        ) : (
                                            <span className="text-emerald-600 text-xs">All clear</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-600">{patient.diet_preference || 'Not set'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/nurse/vitals/${patient.id}`)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 border border-blue-200 transition-colors"
                                            >
                                                <Heart className="h-3 w-3" /> Vitals
                                            </button>
                                            <button
                                                onClick={() => navigate(`/nurse/emar/${patient.id}`)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-100 border border-violet-200 transition-colors"
                                            >
                                                <ClipboardList className="h-3 w-3" /> eMAR
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.activePatients.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        No active IPD patients
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NurseDashboard;
