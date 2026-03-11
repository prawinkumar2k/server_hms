import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, History, FilePlus, AlertCircle, Plus, Minus, Trash2, Pill } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import MedicineSearch from '../../components/common/MedicineSearch';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { usePatients } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';

const MedicalNotes = () => {
    const { visitId } = useParams(); // This is the Patient ID basically
    const navigate = useNavigate();
    const { getPatientById, updatePatientStatus, patients } = usePatients();
    const toast = useToast();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dicomStudies, setDicomStudies] = useState([]);

    // Notes State
    const [notes, setNotes] = useState({
        chiefComplaint: '',
        history: '',
        physicalExamination: '',
        diagnosis: '',
        plan: '',
        followUp: ''
    });

    // Vitals State
    const [vitals, setVitals] = useState({
        bp: '120/80',
        heartRate: '72',
        temperature: '98.6',
        spo2: '98'
    });
    const [isEditingVitals, setIsEditingVitals] = useState(false);

    // History State
    const [showHistory, setShowHistory] = useState(false);
    const [historyRecords, setHistoryRecords] = useState([]);

    // Prescription History State
    const [showPrescriptions, setShowPrescriptions] = useState(false);
    const [prescriptionHistory, setPrescriptionHistory] = useState([]);

    // Suggestion / Medicine State
    const [medicines, setMedicines] = useState([
        { name: '', qty: '', food: 'After Food', morning: '0', noon: '0', night: '0', days: '0' }
    ]);
    const [products, setProducts] = useState([]); // Master list of medicines

    const handleAddMedicine = () => {
        if (medicines.length >= 4) return toast.warning("Maximum 4 medicines allowed.");
        setMedicines([...medicines, { name: '', qty: '', food: 'After Food', morning: '0', noon: '0', night: '0', days: '0' }]);
    };

    const handleRemoveMedicine = (index) => {
        const newMeds = [...medicines];
        newMeds.splice(index, 1);
        setMedicines(newMeds);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMeds = [...medicines];
        newMeds[index][field] = value;
        setMedicines(newMeds);
    };

    useEffect(() => {
        const foundPatient = getPatientById(visitId);
        if (foundPatient) {
            setPatient({
                ...foundPatient,
                allergies: foundPatient.allergies || "None known"
            });
        }

        // Fetch products for autocomplete
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/pharmacy/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (e) {
                console.error("Failed to fetch products", e);
            }
        };
        fetchProducts();

        const fetchDicom = async (pId) => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/dicom/patient/${pId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json.status === 'success') {
                        setDicomStudies(json.data);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch dicom studies", e);
            }
        };

        if (foundPatient && foundPatient.id) {
            fetchDicom(foundPatient.id);
        }

    }, [visitId, getPatientById]);

    const handleSave = async () => {
        if (!patient) return;
        setLoading(true);
        try {
            const payload = {
                patientId: patient.id,
                visitDate: new Date().toISOString().split('T')[0],
                symptoms: notes.chiefComplaint,
                history: notes.history,
                physicalExam: notes.physicalExamination,
                diagnosis: notes.diagnosis,
                plan: notes.plan,
                followUp: notes.followUp,
                ...vitals
            };

            const res = await fetch('/api/medical-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Also save prescription if needed (handled in next step)
            // But here we keep the record save

            if (!res.ok) throw new Error('Failed to save');

            // Save Prescription if valid medicines exist
            const validMedicines = medicines.filter(m => m.name.trim() !== '');
            if (validMedicines.length > 0) {
                await fetch('/api/prescriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        patientId: patient.id,
                        patientName: patient.name,
                        age: patient.age,
                        gender: patient.gender,
                        date: new Date().toISOString().split('T')[0],
                        diagnosis: notes.diagnosis,
                        notes: notes.chiefComplaint, // or diagnosis + symptoms
                        vitals: { temp: vitals.temperature, bp: vitals.bp },
                        medicines: validMedicines
                    })
                });
            }

            // Mark patient as Completed
            await updatePatientStatus(patient.id, 'Completed');

            // Find next waiting patient (simple logic: first Waiting that isn't current)
            const nextPatient = patients.find(p => p.status === 'Waiting' && p.id !== patient.id);

            toast.success('Medical notes & Vitals saved successfully!');

            if (nextPatient) {
                if (window.confirm(`Proceed to next waiting patient: ${nextPatient.name}?`)) {
                    navigate(`/doctor/notes/${nextPatient.id}`);
                } else {
                    navigate('/doctor/consultations');
                }
            } else {
                navigate('/doctor/consultations');
            }

        } catch (error) {
            console.error(error);
            toast.error('Error saving notes.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrescribe = async () => {
        if (!medicines.some(m => m.name.trim() !== '')) {
            toast.warning("Please add at least one medicine before prescribing.");
            return;
        }

        // Validate all added medicines have required fields
        const invalid = medicines.filter(m => m.name.trim() !== '' && (!m.qty || !m.days));
        if (invalid.length > 0) {
            toast.warning("Please fill Quantity and Days for all medicines.");
            return;
        }

        const validMedicines = medicines.filter(m => m.name.trim() !== '');
        setLoading(true);

        try {
            const res = await fetch('/api/prescriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: patient.id,
                    patientName: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                    date: new Date().toISOString().split('T')[0],
                    diagnosis: notes.diagnosis || 'Provisional',
                    doctorName: 'Dr. Sarah Wilson', // TODO: Get from Auth Context
                    notes: notes.chiefComplaint,
                    vitals: { temp: vitals.temperature, bp: vitals.bp },
                    medicines: validMedicines,
                    status: 'PENDING_PHARMACY'
                })
            });

            if (res.ok) {
                toast.success("Prescription sent to Pharmacy successfully!");
            } else {
                throw new Error("Failed to send prescription");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error sending prescription.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        if (!patient) return;
        try {
            const res = await fetch(`/api/medical-records/${patient.id}`);
            if (res.ok) {
                const data = await res.json();
                setHistoryRecords(data);
                setShowHistory(true);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load history');
        }
    };

    const fetchPrescriptions = async () => {
        if (!patient) return;
        try {
            const res = await fetch(`/api/prescriptions/patient/${patient.id}`);
            if (res.ok) {
                const data = await res.json();
                setPrescriptionHistory(data);
                setShowPrescriptions(true);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load prescriptions');
        }
    };

    if (!patient) return <div className="p-10 text-center">Loading Patient Data...</div>;

    return (
        <PageTransition>
            <div className="space-y-6 relative">
                {/* History Modal Overlay */}
                {showHistory && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Patient History</h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>Close</Button>
                            </div>
                            <div className="p-4 overflow-y-auto space-y-4">
                                {historyRecords.length === 0 ? (
                                    <p className="text-slate-500 text-center">No previous records found.</p>
                                ) : (
                                    historyRecords.map(record => (
                                        <div key={record.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold">{new Date(record.visit_date).toLocaleDateString()}</span>
                                                <span className="text-xs text-slate-500">Dr. {record.doctor_id}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="font-semibold text-slate-700">Diagnosis</p>
                                                    <p>{record.diagnosis || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">Treatment</p>
                                                    <p>{record.treatment_plan || '-'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="font-semibold text-slate-700">Symptoms</p>
                                                    <p>{record.symptoms || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {/* Prescription History Modal */}
                {showPrescriptions && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Prescription History</h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowPrescriptions(false)}>Close</Button>
                            </div>
                            <div className="p-4 overflow-y-auto space-y-4">
                                {prescriptionHistory.length === 0 ? (
                                    <p className="text-slate-500 text-center">No previous prescriptions found.</p>
                                ) : (
                                    prescriptionHistory.map((rx, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold">{rx.date}</span>
                                                <span className="text-xs text-slate-500">Diagnosis: {rx.diagnosis}</span>
                                            </div>
                                            <div className="space-y-2">
                                                {rx.medicines.map((med, i) => (
                                                    <div key={i} className="flex justify-between text-sm border-b border-slate-100 pb-1 last:border-0">
                                                        <span className="font-medium text-slate-700">{med.name}</span>
                                                        <span className="text-slate-500">{med.qty} qty • {med.days} days ({med.morning}-{med.noon}-{med.night}) {med.food}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Notes</h1>
                            <p className="text-slate-500">Consultation for <span className="font-semibold text-slate-700">{patient.name}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={fetchHistory}>
                            <History className="mr-2 h-4 w-4" /> History
                        </Button>
                        <Button variant="outline" onClick={fetchPrescriptions}>
                            <FilePlus className="mr-2 h-4 w-4" /> Prev. Rx
                        </Button>
                        <Button variant="primary" onClick={handleSave} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Notes'}
                        </Button>
                    </div>
                </div>

                {/* Patient Summary (Unchanged) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                            {(patient.name || "?").charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{patient.name}</p>
                            <p className="text-xs text-slate-500">{patient.age} yrs • {patient.gender}</p>
                        </div>
                    </div>
                    {/* ... other summary items ... */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Input Area (Clinical Notes) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FilePlus className="h-4 w-4 text-slate-500" />
                                    Clinical Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Symptoms */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Symptoms / Chief Complaint</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[80px]"
                                        placeholder="Patient's primary symptoms..."
                                        value={notes.chiefComplaint}
                                        onChange={(e) => setNotes({ ...notes, chiefComplaint: e.target.value })}
                                    />
                                </div>
                                {/* History & Exam */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">History of Present Illness</label>
                                        <textarea
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[120px]"
                                            value={notes.history}
                                            onChange={(e) => setNotes({ ...notes, history: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Physical Examination</label>
                                        <textarea
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[120px]"
                                            value={notes.physicalExamination}
                                            onChange={(e) => setNotes({ ...notes, physicalExamination: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {/* Diagnosis */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Provisional Diagnosis</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                        value={notes.diagnosis}
                                        onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
                                    />
                                </div>
                                {/* Plan */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Treatment Plan</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[80px]"
                                        value={notes.plan}
                                        onChange={(e) => setNotes({ ...notes, plan: e.target.value })}
                                    />
                                </div>
                                {/* Follow Up */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Follow-up Advice</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                        value={notes.followUp}
                                        onChange={(e) => setNotes({ ...notes, followUp: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prescriptions */}
                        <Card>
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle>Prescribe Medicines</CardTitle>
                                    <Button variant="outline" size="sm" onClick={handleAddMedicine} disabled={medicines.length >= 4}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Medicine
                                    </Button>
                                    <Button size="sm" onClick={handlePrescribe} disabled={loading} className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Pill className="h-4 w-4 mr-2" /> {loading ? 'Sending...' : 'Prescribe'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {medicines.map((med, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                                        <div className="col-span-4">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Medicine Name</label>
                                            <MedicineSearch
                                                products={products}
                                                value={med.name}
                                                onChange={(val) => handleMedicineChange(index, 'name', val)}
                                                onSelect={(item) => {
                                                    handleMedicineChange(index, 'name', item.ProductName);
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Qty</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-primary-500"
                                                placeholder="10"
                                                value={med.qty}
                                                onChange={(e) => handleMedicineChange(index, 'qty', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Days</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-primary-500"
                                                placeholder="5"
                                                value={med.days}
                                                onChange={(e) => handleMedicineChange(index, 'days', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-3 flex gap-1">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-medium text-slate-500 mb-1 block text-center">M</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 text-sm border border-slate-200 rounded text-center"
                                                    value={med.morning}
                                                    onChange={(e) => handleMedicineChange(index, 'morning', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-medium text-slate-500 mb-1 block text-center">N</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 text-sm border border-slate-200 rounded text-center"
                                                    value={med.noon}
                                                    onChange={(e) => handleMedicineChange(index, 'noon', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-medium text-slate-500 mb-1 block text-center">N</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 text-sm border border-slate-200 rounded text-center"
                                                    value={med.night}
                                                    onChange={(e) => handleMedicineChange(index, 'night', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 mt-2 grid grid-cols-2 gap-2">
                                            <select
                                                className="text-xs p-2 border border-slate-200 rounded"
                                                value={med.food}
                                                onChange={(e) => handleMedicineChange(index, 'food', e.target.value)}
                                            >
                                                <option>After Food</option>
                                                <option>Before Food</option>
                                            </select>
                                        </div>
                                        <div className="absolute -top-2 -right-2 hidden group-hover:block">
                                            <button
                                                onClick={() => handleRemoveMedicine(index)}
                                                className="bg-red-50 text-red-500 p-1 rounded-full shadow-sm border border-red-100 hover:bg-red-100"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Vitals Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vitals</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* BP */}
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase">BP</p>
                                        {isEditingVitals ? (
                                            <input type="text" className="w-full bg-white border border-slate-300 rounded px-1 active:ring-1" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} />
                                        ) : (
                                            <p className="text-lg font-bold text-slate-900">{vitals.bp}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400">mmHg</p>
                                    </div>
                                    {/* HR */}
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase">Heart Rate</p>
                                        {isEditingVitals ? (
                                            <input type="text" className="w-full bg-white border border-slate-300 rounded px-1 active:ring-1" value={vitals.heartRate} onChange={e => setVitals({ ...vitals, heartRate: e.target.value })} />
                                        ) : (
                                            <p className="text-lg font-bold text-slate-900">{vitals.heartRate}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400">bpm</p>
                                    </div>
                                    {/* Temp */}
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase">Temp</p>
                                        {isEditingVitals ? (
                                            <input type="text" className="w-full bg-white border border-slate-300 rounded px-1 active:ring-1" value={vitals.temperature} onChange={e => setVitals({ ...vitals, temperature: e.target.value })} />
                                        ) : (
                                            <p className="text-lg font-bold text-slate-900">{vitals.temperature}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400">°F</p>
                                    </div>
                                    {/* SpO2 */}
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase">SpO2</p>
                                        {isEditingVitals ? (
                                            <input type="text" className="w-full bg-white border border-slate-300 rounded px-1 active:ring-1" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} />
                                        ) : (
                                            <p className="text-lg font-bold text-slate-900">{vitals.spo2}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400">%</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-xs" onClick={() => setIsEditingVitals(!isEditingVitals)}>
                                    {isEditingVitals ? 'Done' : 'Update Vitals'}
                                </Button>
                            </CardContent>
                        </Card>
                        {/* Lab & Radiology (Unchanged) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Lab & Radiology</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="secondary" className="w-full justify-start text-sm" onClick={() => navigate('/doctor/lab-request')}>
                                    <FilePlus className="mr-2 h-4 w-4" /> Request Lab Test
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate('/doctor/lab-results')}>
                                    <History className="mr-2 h-4 w-4" /> View Recent Results
                                </Button>
                                {dicomStudies.length > 0 && (
                                    <div className="pt-2 border-t border-slate-100 mt-2">
                                        <p className="text-xs text-slate-500 font-medium mb-2">DICOM Studies</p>
                                        {dicomStudies.map(study => (
                                            <Button
                                                key={study.id}
                                                variant="outline"
                                                className="w-full justify-start text-sm mb-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                                                onClick={() => navigate(`/doctor/xray/${study.id}`)}
                                            >
                                                <FilePlus className="mr-2 h-4 w-4" /> {study.modality || 'X-Ray'} - {new Date(study.study_date).toLocaleDateString()}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default MedicalNotes;
