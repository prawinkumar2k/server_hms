import React, { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import PatientSearch from '../../components/common/PatientSearch';

const OPD = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        patient_name: '',
        age: '',
        gender: 'Male',
        contact: '',
        doctor_name: '',
        symptoms: ''
    });

    const [diagnosisData, setDiagnosisData] = useState({ diagnosis: '' });

    const fetchVisits = async () => {
        try {
            const res = await fetch('/api/opd');
            const data = await res.json();
            setVisits(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/opd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchVisits();
                setFormData({ patient_name: '', age: '', gender: 'Male', contact: '', doctor_name: '', symptoms: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/opd/${selectedVisit.id}/complete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(diagnosisData)
            });
            if (res.ok) {
                setCompleteModalOpen(false);
                fetchVisits();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openCompleteModal = (visit) => {
        setSelectedVisit(visit);
        setDiagnosisData({ diagnosis: '' });
        setCompleteModalOpen(true);
    };

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">OPD Management</h1>
                        <p className="text-slate-500">Out-Patient Department: Walk-ins and Visit Logs.</p>
                    </div>
                    <Button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <Plus className="h-4 w-4 mr-2" /> Register Patient
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Doctor</th>
                                    <th className="px-6 py-4">Symptoms</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                                ) : visits.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-slate-500">No active visits.</td></tr>
                                ) : (
                                    visits.map(visit => (
                                        <tr key={visit.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-bold text-slate-900">{visit.patient_name}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {visit.age}y / {visit.gender}
                                                <div className="text-xs">{visit.contact}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{visit.doctor_name}</td>
                                            <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{visit.symptoms}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {visit.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {visit.status !== 'Completed' && (
                                                    <Button size="sm" variant="outline" onClick={() => openCompleteModal(visit)} className="text-emerald-600 hover:bg-emerald-50 border-emerald-200">
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Complete
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Registration Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">Register Walk-in Patient</h3>
                                <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>X</Button>
                            </div>
                            <form onSubmit={handleRegister} className="p-6 space-y-4">
                                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 mb-2">
                                    <label className="text-xs font-bold text-indigo-800 block mb-2">Search Existing Patient (Auto-Fill)</label>
                                    <PatientSearch
                                        placeholder="Search by Name, ID, or Mobile..."
                                        onSelect={(p) => {
                                            if (p) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    patient_name: p.patientName,
                                                    age: p.age,
                                                    gender: p.sex || 'Male',
                                                    contact: p.mobile
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Patient Name</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Age</label>
                                        <input type="number" required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Gender</label>
                                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Contact</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Assign Doctor</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Symptoms</label>
                                    <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none h-20 resize-none"
                                        value={formData.symptoms} onChange={e => setFormData({ ...formData, symptoms: e.target.value })} />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">Register Visit</Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Complete Visit Modal */}
                {completeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">Complete Visit</h3>
                                <Button variant="ghost" size="sm" onClick={() => setCompleteModalOpen(false)}>X</Button>
                            </div>
                            <form onSubmit={handleComplete} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Diagnosis / Remarks</label>
                                    <textarea required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none h-32 resize-none"
                                        value={diagnosisData.diagnosis} onChange={e => setDiagnosisData({ ...diagnosisData, diagnosis: e.target.value })} />
                                </div>
                                <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Finalize Visit</Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default OPD;
