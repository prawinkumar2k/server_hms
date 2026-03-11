import React, { useState, useEffect } from 'react';
import { Search, Plus, BedDouble, User, Calendar, CheckCircle, ArrowRight, Activity, Filter } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import PatientSearch from '../../components/common/PatientSearch';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import { useAuth } from '../../context/AuthContext';

const IPD = () => {
    const { user } = useAuth();
    const [beds, setBeds] = useState([]);
    const [admissions, setAdmissions] = useState([]);
    const [view, setView] = useState('beds'); // 'beds' or 'list'
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Billing Modal
    const [billModalOpen, setBillModalOpen] = useState(false);
    const [billData, setBillData] = useState(null);

    // Patient Details Modal (for occupied beds)
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Discharge Confirm Dialog
    const [dischargeConfirmOpen, setDischargeConfirmOpen] = useState(false);
    const [dischargeId, setDischargeId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        patient_id: '',
        patient_name: '',
        doctor_name: '',
        bed_id: '',
        admission_date: new Date().toISOString().split('T')[0],
        reason: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resBeds, resAdm] = await Promise.all([
                fetch('/api/ipd/beds'),
                fetch('/api/ipd/admissions')
            ]);

            const bedsData = await resBeds.json();
            const admData = await resAdm.json();

            setBeds(Array.isArray(bedsData) ? bedsData : []);
            setAdmissions(Array.isArray(admData) ? admData : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handlePatientSearch = async () => {
        if (!formData.patient_id) return alert("Enter Patient ID");
        try {
            const res = await fetch(`/api/lab/patients?term=${formData.patient_id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, patient_name: data[0].patientName, patient_id: data[0].patientId }));
                } else {
                    alert("Patient not found");
                }
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/ipd/admissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchData();
                setFormData({ patient_name: '', doctor_name: '', bed_id: '', admission_date: new Date().toISOString().split('T')[0], reason: '' });
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDischargeClick = (id) => {
        setDischargeId(id);
        setDischargeConfirmOpen(true);
    };

    const handleDischargeConfirm = async () => {
        if (!dischargeId) return;
        try {
            const res = await fetch(`/api/ipd/admissions/${dischargeId}/discharge`, { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setBillData(data);
                setBillModalOpen(true);
                fetchData();
            } else {
                alert("Error discharging patient");
            }
        } catch (err) {
            console.error(err);
        }
        setDischargeId(null);
    };

    // Calculate Stats
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
    const availableBeds = totalBeds - occupiedBeds;

    // Group Beds by Ward
    const bedsByWard = beds.reduce((acc, bed) => {
        if (!acc[bed.ward]) acc[bed.ward] = [];
        acc[bed.ward].push(bed);
        return acc;
    }, {});

    // Handle clicking on an occupied bed
    const handleBedClick = (bed) => {
        if (bed.status === 'Occupied') {
            // Find the patient admitted to this bed
            const admission = admissions.find(adm => adm.bed_id === bed.id || adm.bed_number === bed.number);
            if (admission) {
                setSelectedPatient({
                    ...admission,
                    bed_number: bed.number,
                    ward: bed.ward,
                    bed_type: bed.type
                });
                setPatientModalOpen(true);
            } else {
                alert('Patient details not found for this bed');
            }
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">IPD Management</h1>
                        <p className="text-slate-500">In-Patient Department: Bed management and Admissions.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                            <button onClick={() => setView('beds')} className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${view === 'beds' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Bed View</button>
                            <button onClick={() => setView('list')} className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Admissions List</button>
                        </div>
                        {user?.role?.toLowerCase() !== 'admin' && (
                            <Button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <Plus className="h-4 w-4 mr-2" /> Admit Patient
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Beds</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalBeds}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <BedDouble className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Available</p>
                                <h3 className="text-3xl font-bold text-emerald-600 mt-2">{availableBeds}</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Occupied</p>
                                <h3 className="text-3xl font-bold text-red-600 mt-2">{occupiedBeds}</h3>
                            </div>
                            <div className="p-3 bg-red-50 rounded-xl">
                                <Activity className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content View */}
                {view === 'beds' ? (
                    <div className="space-y-8">
                        {Object.keys(bedsByWard).map(ward => (
                            <div key={ward} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    {ward}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {bedsByWard[ward].map(bed => (
                                        <div key={bed.id}
                                            onClick={() => handleBedClick(bed)}
                                            className={`relative p-4 rounded-xl border-2 transition-all group ${bed.status === 'Available'
                                                ? 'border-emerald-100 bg-emerald-50/30 hover:border-emerald-300'
                                                : bed.status === 'Occupied'
                                                    ? 'border-red-100 bg-red-50/30 hover:border-red-300 cursor-pointer hover:shadow-md'
                                                    : 'border-slate-100 bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-lg text-slate-700">{bed.number}</span>
                                                <BedDouble className={`h-5 w-5 ${bed.status === 'Available' ? 'text-emerald-500' : 'text-red-500'}`} />
                                            </div>
                                            <div className="text-xs font-medium uppercase tracking-wider mb-1 text-slate-500">{bed.type}</div>
                                            <div className={`text-xs font-bold ${bed.status === 'Available' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {bed.status}
                                            </div>
                                            {/* Show click hint for occupied beds */}
                                            {bed.status === 'Occupied' && (
                                                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                    <span className="text-xs text-red-700 font-medium bg-white/80 px-2 py-1 rounded shadow-sm">View Patient</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Bed</th>
                                        <th className="px-6 py-4">Ward</th>
                                        <th className="px-6 py-4">Doctor</th>
                                        <th className="px-6 py-4">Adm. Date</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {admissions.map(adm => (
                                        <tr key={adm.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-bold text-slate-900">{adm.patient_name}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium border border-blue-100">{adm.bed_number}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{adm.ward}</td>
                                            <td className="px-6 py-4 text-slate-500">{adm.doctor_name}</td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(adm.admission_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                {user?.role?.toLowerCase() !== 'admin' ? (
                                                    <Button size="sm" variant="outline" onClick={() => handleDischargeClick(adm.id)} className="text-red-600 hover:bg-red-50 border-red-200">
                                                        Discharge
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">View Only</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {admissions.length === 0 && (
                                        <tr><td colSpan="6" className="text-center py-8 text-slate-500">No active admissions.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}

                {/* Admit Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">Admit Patient</h3>
                                <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>X</Button>
                            </div>
                            <form onSubmit={handleAdmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Patient ID</label>
                                    <PatientSearch
                                        placeholder="Search Patient (ID, Name, Mobile)"
                                        onSelect={(p) => {
                                            if (p) {
                                                setFormData(prev => ({ ...prev, patient_name: p.patientName, patient_id: p.patientId }));
                                            } else {
                                                setFormData(prev => ({ ...prev, patient_name: '', patient_id: '' }));
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Patient Name</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none bg-slate-50"
                                        value={formData.patient_name} readOnly />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Select Bed (Available Only)</label>
                                    <select required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.bed_id} onChange={e => setFormData({ ...formData, bed_id: e.target.value })}>
                                        <option value="">-- Select Bed --</option>
                                        {beds.filter(b => b.status === 'Available').map(b => (
                                            <option key={b.id} value={b.id}>{b.ward} - {b.number} ({b.type})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Doctor Name</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Admission Date</label>
                                    <input type="date" required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.admission_date} onChange={e => setFormData({ ...formData, admission_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Reason / Diagnosis</label>
                                    <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none h-20 resize-none"
                                        value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">Confirm Admission</Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Bill Preview Modal */}
                {billModalOpen && billData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-emerald-50/50">
                                <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" /> Patient Discharged
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => setBillModalOpen(false)}>X</Button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="text-center">
                                    <p className="text-slate-500 text-sm">Bill Generated Successfully</p>
                                    <h2 className="text-3xl font-bold text-slate-900 mt-1">₹ {billData.grandTotal}</h2>
                                    <p className="text-xs font-mono text-slate-400 mt-1">Bill No: {billData.billNo}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-2 border border-slate-100">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Days</span>
                                        <span className="font-medium text-slate-900">{billData.days} Days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Room Charges</span>
                                        <span className="font-medium text-slate-900">₹ {billData.grandTotal}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                                        <span className="text-slate-700">Net Payable</span>
                                        <span className="text-emerald-700">₹ {billData.grandTotal}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <Button className="w-full bg-slate-800 text-white" onClick={() => window.print()}>Print Bill</Button>
                                    <Button className="w-full" variant="outline" onClick={() => setBillModalOpen(false)}>Close</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Printable Bill - Hidden on screen, visible only when printing */}
                {billModalOpen && billData && (
                    <div className="printable-content hidden print:block">
                        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000' }}>
                            {/* Hospital Header */}
                            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
                                <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>HMS - Hospital Management System</h1>
                                <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0' }}>IPD Discharge Bill</p>
                            </div>

                            {/* Bill Info */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
                                <div>
                                    <p style={{ margin: '2px 0' }}><strong>Bill No:</strong> {billData.billNo}</p>
                                    <p style={{ margin: '2px 0' }}><strong>Patient:</strong> {billData.patientName || '—'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '2px 0' }}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                    <p style={{ margin: '2px 0' }}><strong>Ward / Bed:</strong> {billData.ward || '—'} / {billData.bedNumber || '—'}</p>
                                </div>
                            </div>

                            {/* Charges Table */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #000' }}>
                                        <th style={{ textAlign: 'left', padding: '8px 4px' }}>Description</th>
                                        <th style={{ textAlign: 'right', padding: '8px 4px' }}>Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px 4px' }}>Room Charges ({billData.days} Days)</td>
                                        <td style={{ padding: '8px 4px', textAlign: 'right' }}>₹ {billData.grandTotal}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold' }}>
                                        <td style={{ padding: '10px 4px' }}>Net Payable</td>
                                        <td style={{ padding: '10px 4px', textAlign: 'right' }}>₹ {billData.grandTotal}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Footer */}
                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <div>
                                    <div style={{ borderTop: '1px solid #000', width: '150px', textAlign: 'center', paddingTop: '4px' }}>Patient Signature</div>
                                </div>
                                <div>
                                    <div style={{ borderTop: '1px solid #000', width: '150px', textAlign: 'center', paddingTop: '4px' }}>Authorized Signature</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patient Details Modal (for occupied beds) */}
                {patientModalOpen && selectedPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-blue-50/50">
                                <h3 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                                    <User className="h-5 w-5" /> Patient Details
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => { setPatientModalOpen(false); setSelectedPatient(null); }}>X</Button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Patient Name */}
                                <div className="text-center pb-4 border-b border-slate-100">
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.patient_name}</h2>
                                    <p className="text-sm text-slate-500">Patient ID: {selectedPatient.patient_id}</p>
                                </div>

                                {/* Bed Info */}
                                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <BedDouble className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{selectedPatient.ward} - {selectedPatient.bed_number}</p>
                                            <p className="text-xs text-slate-500">{selectedPatient.bed_type} Bed</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Doctor</span>
                                        <span className="font-medium text-slate-900">{selectedPatient.doctor_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Admission Date</span>
                                        <span className="font-medium text-slate-900">{new Date(selectedPatient.admission_date).toLocaleDateString()}</span>
                                    </div>
                                    {selectedPatient.reason && (
                                        <div className="py-2">
                                            <span className="text-sm text-slate-500 block mb-1">Reason / Diagnosis</span>
                                            <p className="text-sm font-medium text-slate-900 bg-slate-50 p-2 rounded-lg">{selectedPatient.reason}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <Button className="w-full" variant="outline" onClick={() => { setPatientModalOpen(false); setSelectedPatient(null); }}>
                                        Close
                                    </Button>
                                    {user?.role?.toLowerCase() !== 'admin' && (
                                        <Button
                                            className="w-full bg-red-600 text-white hover:bg-red-700"
                                            onClick={() => {
                                                setPatientModalOpen(false);
                                                handleDischargeClick(selectedPatient.id);
                                            }}
                                        >
                                            Discharge Patient
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Discharge Confirm Dialog */}
                <ConfirmDialog
                    isOpen={dischargeConfirmOpen}
                    onClose={() => { setDischargeConfirmOpen(false); setDischargeId(null); }}
                    onConfirm={handleDischargeConfirm}
                    title="Discharge Patient"
                    message="Are you sure you want to discharge this patient and generate the bill?"
                    confirmText="Discharge & Bill"
                    cancelText="Cancel"
                />
            </div>
        </PageTransition>
    );
};

export default IPD;
