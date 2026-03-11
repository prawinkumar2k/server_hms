import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BedDouble, Stethoscope, ClipboardList, FileText, Activity,
    AlertTriangle, LogOut, RefreshCw, Pill, ChevronRight
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const IPDPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchPatients = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/ipd-rounds/patients`, { headers });
            setPatients(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

    const handleInitiateDischarge = async (admissionId) => {
        if (!confirm('Mark this patient as "Ready for Discharge"? This will trigger the clearance workflow.')) return;
        try {
            await axios.post(`${API}/ipd-rounds/discharge/${admissionId}`, {}, { headers });
            alert('Discharge initiated. Clearance workflow started.');
            fetchPatients();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">IPD Patients</h1>
                    <p className="text-sm text-slate-500 mt-1">Clinical care & daily rounds management</p>
                </div>
                <button onClick={fetchPatients} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm text-slate-700 shadow-sm">
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Patient Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {patients.map(p => (
                    <div key={p.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${p.discharge_ready ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                        }`}>
                        <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{p.patient_name}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {p.ward} - {p.bed_number}</span>
                                        <span>ID: {p.patient_id}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.triage_status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        Triage: {p.triage_status}
                                    </span>
                                    {p.discharge_ready ? (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                            Discharge Pending
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-500">Rounds</p>
                                    <p className="text-xl font-bold text-slate-900">{p.total_rounds}</p>
                                </div>
                                <div className={`rounded-lg p-3 text-center ${p.pending_orders > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                                    <p className="text-xs text-slate-500">Pending Orders</p>
                                    <p className={`text-xl font-bold ${p.pending_orders > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{p.pending_orders}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-500">Diet</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 truncate">{p.diet_preference || 'Not set'}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => navigate(`/doctor/rounds/${p.id}`)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 border border-indigo-200 transition-colors">
                                    <Stethoscope className="h-3.5 w-3.5" /> Rounds
                                </button>
                                <button onClick={() => navigate(`/doctor/orders/${p.id}`)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-100 border border-violet-200 transition-colors">
                                    <Pill className="h-3.5 w-3.5" /> Orders
                                </button>
                                <button onClick={() => navigate(`/nurse/vitals/${p.id}`)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 border border-blue-200 transition-colors">
                                    <Activity className="h-3.5 w-3.5" /> Vitals
                                </button>
                                <button onClick={() => navigate(`/ipd/discharge/${p.id}`)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 border border-slate-200 transition-colors">
                                    <FileText className="h-3.5 w-3.5" /> Summary
                                </button>
                                {!p.discharge_ready && (
                                    <button onClick={() => handleInitiateDischarge(p.id)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 border border-amber-200 transition-colors ml-auto">
                                        <LogOut className="h-3.5 w-3.5" /> Initiate Discharge
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {patients.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <BedDouble className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">No admitted patients</p>
                </div>
            )}
        </div>
    );
};

export default IPDPatients;
