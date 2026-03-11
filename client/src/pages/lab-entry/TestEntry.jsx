import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Save, X, Calendar, User, FileText, FlaskConical, Stethoscope, ClipboardList, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import PatientSearch from '../../components/common/PatientSearch';

const TestEntry = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    // Basic Form State
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        age: '',
        sex: '',
        bloodGroup: '',
        refDoctor: '',
        department: '',
        testName: '',
        subTestName: '',
        testId: '',
        testDate: new Date().toISOString().split('T')[0],
        visitDate: new Date().toISOString().split('T')[0],
        mobile: '',
        requestId: null,
        requestItemId: null
    });

    const [loading, setLoading] = useState(false);
    const [searchedPatient, setSearchedPatient] = useState(false);
    const [testHistory, setTestHistory] = useState([]);

    // Pending Requests State
    const [showPending, setShowPending] = useState(false);
    const [pendingList, setPendingList] = useState([]);

    // Master data
    const [departments, setDepartments] = useState([]);
    const [testMaster, setTestMaster] = useState([]);
    const [testNames, setTestNames] = useState([]);
    const [subTestNames, setSubTestNames] = useState([]);

    // Fetch Initial Data
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const res = await fetch('/api/lab/tests');
                if (res.ok) {
                    const data = await res.json();
                    setTestMaster(data);
                    const uniqueDepts = [...new Set(data.map(item => item.department).filter(Boolean))];
                    setDepartments(uniqueDepts);
                }
            } catch (error) { console.error("Error fetching master data:", error); }
        };

        fetchMasterData();
        fetchPendingRequests(false); // Do NOT open modal on mount
    }, []);

    // Auto-fill Doctor Name if User is Doctor
    useEffect(() => {
        if (user && (user.role === 'Doctor' || user.role === 'Admin') && !formData.refDoctor) {
            setFormData(prev => ({ ...prev, refDoctor: user.name }));
        }
    }, [user]);

    // Filter Test Names based on Department
    useEffect(() => {
        if (formData.department) {
            const tests = testMaster
                .filter(t => t.department === formData.department)
                .map(t => t.testName)
                .filter(Boolean);
            setTestNames([...new Set(tests)]);
        } else {
            setTestNames([]);
        }
    }, [formData.department, testMaster]);

    // Filter SubTests based on TestName
    useEffect(() => {
        if (formData.testName) {
            const subTests = testMaster
                .filter(t => t.testName === formData.testName)
                .map(t => t.subTestName)
                .filter(Boolean);
            setSubTestNames([...new Set(subTests)]);
        }
    }, [formData.testName, testMaster]);


    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fetch Patient History
    const fetchTestHistory = async (pid) => {
        if (!pid) {
            setTestHistory([]);
            return;
        }
        try {
            const res = await fetch(`/api/lab/test-entry?patientId=${pid}`);
            if (res.ok) {
                const data = await res.json();
                // Sort by date desc and take top 5-10
                const sorted = data.sort((a, b) => new Date(b.testDate) - new Date(a.testDate)).slice(0, 10);
                setTestHistory(sorted);
            }
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    const handleSubmit = async () => {
        if (!formData.patientId || !formData.testName) {
            toast.warning("Please fill required fields");
            return;
        }

        try {
            const res = await fetch('/api/lab/test-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success("Test Entry Saved Successfully");

                // Workflow: Proceed to Billing?
                if (window.confirm("Entry Saved. Proceed to Lab Billing?")) {
                    navigate('/lab-entry/billing', {
                        state: {
                            patientId: formData.patientId,
                            patientName: formData.patientName,
                            tests: [{ name: formData.testName, price: 0 }]
                        }
                    });
                } else {
                    // Reset form
                    setFormData(prev => ({ ...prev, testName: '', subTestName: '', testId: '' }));

                    // Fetch next ID again
                    const resId = await fetch('/api/lab/next-id');
                    if (resId.ok) {
                        const d = await resId.json();
                        setFormData(prev => ({ ...prev, testId: d.nextId }));
                    }
                }

            } else {
                toast.error("Failed to save");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving");
        }
    };

    // --- Workflow Integration ---
    const fetchPendingRequests = async (openModal = false) => {
        setLoading(true);
        try {
            const res = await fetch('/api/lab/requests/pending');
            if (res.ok) {
                const data = await res.json();
                setPendingList(data);
                if (openModal) setShowPending(true);
            } else {
                if (openModal) toast.error("Failed to fetch pending requests");
            }
        } catch (e) {
            console.error(e);
            if (openModal) toast.error("Error fetching requests");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Next ID
    useEffect(() => {
        const fetchNextId = async () => {
            try {
                const res = await fetch('/api/lab/next-id');
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({ ...prev, testId: data.nextId }));
                }
            } catch (e) { console.error(e); }
        };
        fetchNextId();
    }, []);

    const loadRequest = (req, testItem) => {
        // Auto-fill form
        setFormData(prev => ({
            ...prev,
            patientId: req.patient_id,
            patientName: req.patient_name,
            refDoctor: req.doctor_name,
            department: testItem.category,
            testName: testItem.test_name.split(' - ')[0],
            subTestName: testItem.test_name.split(' - ')[1] || '',
            testDate: new Date().toISOString().split('T')[0],
            visitDate: new Date().toISOString().split('T')[0],
            requestId: req.id,
            requestItemId: testItem.id
        }));

        fetchPatientDetails(req.patient_id);
        setShowPending(false);
        toast.success(`Loaded test: ${testItem.test_name}`);
    };

    const fetchPatientDetails = async (id) => {
        try {
            const res = await fetch(`/api/lab/patients?term=${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const p = data[0];
                    setFormData(prev => ({
                        ...prev,
                        age: p.age,
                        sex: p.sex,
                        mobile: p.mobile
                    }));
                    // Also fetch history
                    fetchTestHistory(p.patientId);
                }
            }
        } catch (e) { console.error(e); }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <FlaskConical className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Test Entry</h1>
                            <p className="text-slate-500">Record patient test details and results.</p>
                        </div>
                    </div>
                    <div>
                        <Button variant="outline" className={`bg-white hover:bg-slate-50 border-indigo-200 ${pendingList.length > 0 ? 'text-indigo-600 border-indigo-500 ring-1 ring-indigo-500' : 'text-slate-500'}`} onClick={() => fetchPendingRequests(true)}>
                            <ClipboardList className="h-4 w-4 mr-2" /> Pending Requests
                            {pendingList.length > 0 && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">{pendingList.length}</span>}
                        </Button>
                    </div>
                </div>

                {/* Pending Requests Modal */}
                {showPending && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-indigo-600" /> Pending Lab Requests
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowPending(false)}><X className="h-4 w-4" /></Button>
                            </div>
                            <div className="p-4 overflow-y-auto space-y-4 flex-1">
                                {pendingList.length === 0 ? (
                                    <p className="text-center text-slate-500 py-8">No pending requests found.</p>
                                ) : (
                                    pendingList.map(req => (
                                        <div key={req.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                                            <div className="flex justify-between mb-3">
                                                <div>
                                                    <p className="font-bold text-slate-900">{req.patient_name}</p>
                                                    <p className="text-xs text-slate-500">ID: {req.patient_id} • Ref: {req.doctor_name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100">{req.priority || 'Routine'}</span>
                                                    <p className="text-xs text-slate-400 mt-1">{new Date(req.request_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded p-3">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Requested Tests</p>
                                                <div className="space-y-2">
                                                    {req.tests && req.tests.map((test, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-700">{test.test_name}</p>
                                                                <p className="text-xs text-slate-400">{test.category}</p>
                                                            </div>
                                                            <Button size="sm" className="h-7 text-xs" onClick={() => loadRequest(req, test)}>
                                                                Process
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Patient Details */}
                    <Card className="lg:col-span-1 h-fit shadow-md border-primary-100">
                        <CardHeader className="bg-primary-50/50 border-b border-primary-100 py-3">
                            <CardTitle className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                                <User className="h-4 w-4" /> Patient Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex gap-2">
                                <div className="space-y-1 flex-1">
                                    <label className="text-xs font-bold text-slate-500">Patient ID</label>
                                    <PatientSearch
                                        onSelect={(p) => {
                                            if (p) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    patientId: p.patientId,
                                                    patientName: p.patientName,
                                                    age: p.age,
                                                    sex: p.sex,
                                                    mobile: p.mobile,
                                                    refDoctor: p.refDoctor || prev.refDoctor
                                                }));
                                                setSearchedPatient(true);
                                                fetchTestHistory(p.patientId);
                                            } else {
                                                setSearchedPatient(false);
                                                setFormData(prev => ({ ...prev, patientName: '', age: '', sex: '', mobile: '' }));
                                                setTestHistory([]);
                                            }
                                        }}
                                        placeholder="Search by ID, Name, Mobile"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Patient Name</label>
                                <input
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className="w-full h-9 rounded-md border-slate-300 text-sm bg-slate-50"
                                    readOnly={searchedPatient}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Age</label>
                                    <input
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full h-9 rounded-md border-slate-300 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Sex</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="w-full h-9 rounded-md border-slate-300 text-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Mobile</label>
                                <input
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full h-9 rounded-md border-slate-300 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Ref Doctor</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        name="refDoctor"
                                        value={formData.refDoctor}
                                        onChange={handleChange}
                                        className="w-full h-9 pl-9 rounded-md border-slate-300 text-sm"
                                        placeholder="Dr. Name"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Test Entry */}
                    <Card className="lg:col-span-2 shadow-md border-slate-200">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Test Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500">Department</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500">Test Name</label>
                                        <select
                                            name="testName"
                                            value={formData.testName}
                                            onChange={handleChange}
                                            className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                        >
                                            <option value="">Select Test</option>
                                            {testNames.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500">Sub Test Name</label>
                                        <select
                                            name="subTestName"
                                            value={formData.subTestName}
                                            onChange={handleChange}
                                            className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                        >
                                            <option value="">Select Sub Test</option>
                                            {subTestNames.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-xs font-bold text-slate-500">Test ID</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    name="testId"
                                                    value={formData.testId}
                                                    className="w-full h-10 rounded-lg border-slate-300 text-sm bg-slate-50"
                                                    readOnly
                                                    placeholder="Auto"
                                                />
                                                <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400">
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500">Entry Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="date"
                                                name="testDate"
                                                value={formData.testDate}
                                                onChange={handleChange}
                                                className="w-full h-10 pl-10 rounded-lg border-slate-300 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500">Visit Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="date"
                                                name="visitDate"
                                                value={formData.visitDate}
                                                onChange={handleChange}
                                                className="w-full h-10 pl-10 rounded-lg border-slate-300 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-500 mb-2 block">Patient's Test ID History</label>
                                <div className="w-full h-32 rounded-lg border border-slate-200 bg-slate-50 p-2 overflow-y-auto text-sm">
                                    {testHistory.length === 0 ? (
                                        <p className="text-slate-400 italic p-2">No history available.</p>
                                    ) : (
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="text-slate-500 border-b border-slate-200">
                                                    <th className="pb-1 pl-2">Date</th>
                                                    <th className="pb-1">Test ID</th>
                                                    <th className="pb-1">Test Name</th>
                                                    <th className="pb-1">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {testHistory.map((h, i) => (
                                                    <tr key={i} className="hover:bg-slate-100">
                                                        <td className="py-1.5 pl-2 text-slate-500">{new Date(h.testDate).toLocaleDateString()}</td>
                                                        <td className="py-1.5 font-mono text-slate-600">{h.id}</td>
                                                        <td className="py-1.5 font-medium text-slate-800">{h.testName}</td>
                                                        <td className="py-1.5">
                                                            <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Done</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 justify-end">
                                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200" onClick={handleSubmit}>
                                    <Save className="h-4 w-4 mr-2" /> Save Entry
                                </Button>
                                <Button size="lg" variant="outline" className="text-slate-600">
                                    Close
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageTransition>
    );
};

export default TestEntry;
