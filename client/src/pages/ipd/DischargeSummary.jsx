import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, Clock, AlertTriangle, FileText,
    Printer, Shield, Heart, FlaskConical, Pill, Stethoscope,
    RefreshCw, LogOut
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DischargeSummary = () => {
    const { admissionId } = useParams();
    const navigate = useNavigate();
    const [clearance, setClearance] = useState({ clearances: [], allCleared: false });
    const [summary, setSummary] = useState(null);
    const [folio, setFolio] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [finalizing, setFinalizing] = useState(false);
    const [followUp, setFollowUp] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = useCallback(async () => {
        try {
            const [clearRes, summaryRes, folioRes] = await Promise.all([
                axios.get(`${API}/discharge/clearance/${admissionId}`, { headers }),
                axios.get(`${API}/discharge/summary/${admissionId}`, { headers }),
                axios.get(`${API}/discharge/folio/${admissionId}`, { headers })
            ]);
            setClearance(clearRes.data);
            setSummary(summaryRes.data);
            setFolio(folioRes.data);
            if (summaryRes.data?.follow_up_instructions) setFollowUp(summaryRes.data.follow_up_instructions);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [admissionId]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleClearDept = async (dept) => {
        try {
            await axios.post(`${API}/discharge/clearance/${admissionId}/clear`, { department: dept }, { headers });
            fetchAll();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await axios.post(`${API}/discharge/summary/${admissionId}/generate`, {}, { headers });
            fetchAll();
        } catch (err) { alert(err.response?.data?.message || 'Error — Not all departments cleared?'); }
        finally { setGenerating(false); }
    };

    const handleFinalize = async () => {
        if (!confirm('Finalize discharge? This will complete billing and free the bed.')) return;
        setFinalizing(true);
        try {
            const res = await axios.post(`${API}/discharge/finalize/${admissionId}`, { follow_up_instructions: followUp }, { headers });
            alert(`Discharged! Bill #${res.data.billNo} — Total: ₹${res.data.grandTotal}`);
            navigate('/doctor/ipd-patients');
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
        finally { setFinalizing(false); }
    };

    const deptIcons = {
        Pantry: '🍽️', Inventory: '📦', Pharmacy: '💊', Ward: '🏥', Billing: '💰'
    };

    const parseJSON = (str) => {
        try { return typeof str === 'string' ? JSON.parse(str) : str; } catch { return []; }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Discharge Summary</h1>
                        <p className="text-sm text-slate-500">Admission #{admissionId}</p>
                    </div>
                </div>
                <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm shadow-sm">
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* ── STEP 1: Clearance Workflow ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-500" /> Clearance Workflow
                </h2>
                <p className="text-sm text-slate-500 mb-4">All departments must clear before discharge summary can be generated.</p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {clearance.clearances.map((c, idx) => (
                        <div key={c.id || idx} className={`rounded-xl border-2 p-4 text-center transition-all ${c.status === 'Cleared' ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'
                            }`}>
                            <div className="text-2xl mb-1">{deptIcons[c.department]}</div>
                            <p className="text-sm font-semibold text-slate-800">{c.department}</p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                                {c.status === 'Cleared' ? (
                                    <span className="flex items-center gap-1 text-emerald-700 text-xs font-medium">
                                        <CheckCircle className="h-3.5 w-3.5" /> Cleared
                                    </span>
                                ) : (
                                    <button onClick={() => handleClearDept(c.department)}
                                        className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 shadow-sm transition-colors">
                                        Clear
                                    </button>
                                )}
                            </div>
                            {c.cleared_by_name && <p className="text-xs text-slate-400 mt-1">{c.cleared_by_name}</p>}
                        </div>
                    ))}
                </div>

                {clearance.clearances.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                        <p>Discharge not yet initiated. Doctor must click "Initiate Discharge" first.</p>
                    </div>
                )}

                {/* Generate Summary Button */}
                {clearance.allCleared && !summary?.is_finalized && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                        <button onClick={handleGenerate} disabled={generating}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all">
                            <FileText className="h-4 w-4" /> {generating ? 'Generating...' : 'Generate Discharge Summary'}
                        </button>
                    </div>
                )}
            </div>

            {/* ── STEP 2: Billing Folio ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Running Billing Folio</h2>
                {folio.items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-4 py-2 font-medium text-slate-600">Type</th>
                                    <th className="text-left px-4 py-2 font-medium text-slate-600">Description</th>
                                    <th className="text-center px-4 py-2 font-medium text-slate-600">Qty</th>
                                    <th className="text-right px-4 py-2 font-medium text-slate-600">Unit Price</th>
                                    <th className="text-right px-4 py-2 font-medium text-slate-600">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {folio.items.map(f => (
                                    <tr key={f.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-slate-700">{f.charge_type}</td>
                                        <td className="px-4 py-2 text-slate-900">{f.description}</td>
                                        <td className="px-4 py-2 text-center">{f.quantity}</td>
                                        <td className="px-4 py-2 text-right">₹{parseFloat(f.unit_price || 0).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right font-medium">₹{parseFloat(f.total_price || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t-2 border-slate-200">
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-right font-bold text-slate-900">Total Folio Charges</td>
                                    <td className="px-4 py-3 text-right font-bold text-lg text-indigo-600">₹{folio.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 text-center py-4">No charges recorded in patient folio</p>
                )}
            </div>

            {/* ── STEP 3: Discharge Summary ── */}
            {summary && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6" id="discharge-print">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Discharge Summary Report</h2>
                        {summary.is_finalized && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">FINALIZED</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Admission Date:</span> <span className="font-medium ml-2">{summary.admission_date}</span></div>
                        <div><span className="text-slate-500">Discharge Date:</span> <span className="font-medium ml-2">{summary.discharge_date}</span></div>
                        <div className="col-span-2"><span className="text-slate-500">Reason for Admission:</span> <span className="font-medium ml-2">{summary.admission_reason || 'N/A'}</span></div>
                    </div>

                    {/* Initial Vitals */}
                    {(() => {
                        const iv = parseJSON(summary.initial_vitals);
                        return iv && Object.keys(iv).length > 0 ? (
                            <div className="border-l-4 border-l-blue-400 bg-blue-50 rounded-r-lg p-4">
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> Initial Vitals (Triage)</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {iv.bp_systolic && <span>BP: {iv.bp_systolic}/{iv.bp_diastolic}</span>}
                                    {iv.temperature && <span>Temp: {iv.temperature}°F</span>}
                                    {iv.pulse && <span>Pulse: {iv.pulse}</span>}
                                    {iv.spo2 && <span>SpO2: {iv.spo2}%</span>}
                                </div>
                            </div>
                        ) : null;
                    })()}

                    {/* Lab Results */}
                    {(() => {
                        const labs = parseJSON(summary.lab_results);
                        return labs && labs.length > 0 ? (
                            <div className="border-l-4 border-l-amber-400 bg-amber-50 rounded-r-lg p-4">
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" /> Lab Results</p>
                                <ul className="text-sm space-y-1">{labs.map((l, i) => <li key={i}>{l.name} — {l.status}</li>)}</ul>
                            </div>
                        ) : null;
                    })()}

                    {/* Course in Hospital */}
                    {summary.course_in_hospital && (
                        <div className="border-l-4 border-l-indigo-400 bg-indigo-50 rounded-r-lg p-4">
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" /> Course in Hospital (SOAP Notes)</p>
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{summary.course_in_hospital}</pre>
                        </div>
                    )}

                    {/* Final Diagnosis */}
                    {summary.final_diagnosis && (
                        <div className="border-l-4 border-l-rose-400 bg-rose-50 rounded-r-lg p-4">
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Final Diagnosis</p>
                            <p className="text-sm text-slate-800">{summary.final_diagnosis}</p>
                        </div>
                    )}

                    {/* Discharge Medications */}
                    {(() => {
                        const meds = parseJSON(summary.discharge_medications);
                        return meds && meds.length > 0 ? (
                            <div className="border-l-4 border-l-violet-400 bg-violet-50 rounded-r-lg p-4">
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Pill className="h-3.5 w-3.5" /> Discharge Medications</p>
                                <ul className="text-sm space-y-1">{meds.map((m, i) => <li key={i}>{m.name} {m.dosage && `— ${m.dosage}`} {m.frequency && `(${m.frequency})`}</li>)}</ul>
                            </div>
                        ) : null;
                    })()}

                    {/* Follow-up */}
                    {!summary.is_finalized && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Follow-up Instructions</label>
                            <textarea value={followUp} onChange={e => setFollowUp(e.target.value)} rows={3} placeholder="Follow-up date, special diet at home, review appointment..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                        </div>
                    )}

                    {summary.follow_up_instructions && summary.is_finalized && (
                        <div className="border-l-4 border-l-green-400 bg-green-50 rounded-r-lg p-4">
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Follow-up Instructions</p>
                            <p className="text-sm text-slate-800">{summary.follow_up_instructions}</p>
                        </div>
                    )}

                    {/* Finalize Button */}
                    {!summary.is_finalized && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button onClick={handleFinalize} disabled={finalizing}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-200 transition-all">
                                <LogOut className="h-4 w-4" /> {finalizing ? 'Processing...' : 'Finalize & Discharge Patient'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DischargeSummary;
