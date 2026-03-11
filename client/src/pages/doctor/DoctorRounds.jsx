import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, FileText, Stethoscope, Clock,
    ChevronDown, ChevronUp, Send
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DoctorRounds = () => {
    const { admissionId } = useParams();
    const navigate = useNavigate();
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRound, setExpandedRound] = useState(null);
    const [form, setForm] = useState({ subjective: '', objective: '', assessment: '', plan: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchRounds = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/ipd-rounds/rounds/${admissionId}`, { headers });
            setRounds(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [admissionId]);

    useEffect(() => { fetchRounds(); }, [fetchRounds]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API}/ipd-rounds/rounds`, {
                admission_id: parseInt(admissionId), ...form
            }, { headers });
            setShowForm(false);
            setForm({ subjective: '', objective: '', assessment: '', plan: '' });
            fetchRounds();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
        finally { setSubmitting(false); }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/doctor/ipd-patients')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Daily Rounds — SOAP Notes</h1>
                        <p className="text-sm text-slate-500">Admission #{admissionId}</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">
                    <Plus className="h-4 w-4" /> New Round
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-indigo-500" /> Record SOAP Note
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { key: 'subjective', label: 'S — Subjective', placeholder: "Patient's complaints, symptoms, how they feel..." },
                            { key: 'objective', label: 'O — Objective', placeholder: 'Physical exam findings, vitals review, lab results...' },
                            { key: 'assessment', label: 'A — Assessment', placeholder: 'Diagnosis, differentials, clinical impression...' },
                            { key: 'plan', label: 'P — Plan', placeholder: 'Treatment plan, medications, follow-up...' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{f.label}</label>
                                <textarea
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                        ))}
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
                            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-colors">
                                <Send className="h-4 w-4" /> {submitting ? 'Saving...' : 'Save Round'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Rounds Timeline */}
            <div className="space-y-4">
                {rounds.map((round, idx) => (
                    <div key={round.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <button
                            onClick={() => setExpandedRound(expandedRound === round.id ? null : round.id)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Round #{rounds.length - idx}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(round.round_date).toLocaleDateString()}</span>
                                        <span>Dr. {round.doctor_name}</span>
                                    </div>
                                </div>
                            </div>
                            {expandedRound === round.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </button>

                        {expandedRound === round.id && (
                            <div className="px-6 pb-5 space-y-4 border-t border-slate-100 pt-4">
                                {[
                                    { label: 'Subjective', value: round.subjective, color: 'border-l-blue-400 bg-blue-50' },
                                    { label: 'Objective', value: round.objective, color: 'border-l-green-400 bg-green-50' },
                                    { label: 'Assessment', value: round.assessment, color: 'border-l-amber-400 bg-amber-50' },
                                    { label: 'Plan', value: round.plan, color: 'border-l-violet-400 bg-violet-50' },
                                ].map(s => (
                                    <div key={s.label} className={`border-l-4 ${s.color} rounded-r-lg p-4`}>
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">{s.label}</p>
                                        <p className="text-sm text-slate-800 whitespace-pre-wrap">{s.value || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {rounds.length === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium">No rounds recorded yet</p>
                        <p className="text-sm text-slate-400 mt-1">Click "New Round" to begin documenting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorRounds;
