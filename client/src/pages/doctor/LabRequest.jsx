import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, CheckCircle2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { usePatients } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const LabRequest = () => {
    const { patients } = usePatients();
    const toast = useToast();
    const { user } = useAuth();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableTests, setAvailableTests] = useState([]);

    // Patient Search State
    const [patientQuery, setPatientQuery] = useState('');
    const [showPatientResults, setShowPatientResults] = useState(false);

    // Fetch Tests on Mount
    React.useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/lab/tests', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    // Map to a cleaner format if needed, but the service returns decent data
                    // Service: { testName, subTestName, department, price }
                    // We need a unique key.
                    setAvailableTests(data.map((t, i) => ({
                        id: i,
                        name: t.testName + (t.subTestName ? ` - ${t.subTestName}` : ''),
                        category: t.department,
                        price: t.price
                    })));
                }
            } catch (e) {
                console.error("Failed to fetch tests", e);
            }
        };
        fetchTests();
    }, []);

    const filteredPatients = patients.filter(p =>
        (p.name || '').toLowerCase().includes(patientQuery.toLowerCase()) ||
        (p.id && p.id.toString().includes(patientQuery))
    );

    const toggleTest = (test) => {
        if (selectedTests.find(t => t.id === test.id)) {
            setSelectedTests(selectedTests.filter(t => t.id !== test.id));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPatient) return toast.warning("Please select a patient.");
        if (selectedTests.length === 0) return toast.warning("Please select at least one test.");

        try {
            const token = localStorage.getItem('token');
            const payload = {
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
                doctorId: user?.id || 'DOC001',
                doctorName: user?.full_name || user?.username || 'Dr. Sarah Wilson',
                tests: selectedTests,
                notes: 'Requested via Doctor Module'
            };

            const res = await fetch('/api/lab/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Lab request submitted successfully!");
                setSelectedTests([]);
                setSelectedPatient(null);
                setPatientQuery('');
            } else {
                toast.error("Failed to submit request");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error submitting request");
        }
    };

    const filteredTests = availableTests.filter(test =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Test Request</h1>
                    <p className="text-slate-500">Order laboratory tests and diagnostic procedures.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Selection Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Patient Selection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <div className="flex items-center border border-slate-200 rounded-lg p-2 bg-white focus-within:ring-2 ring-primary-500">
                                        <Search className="h-4 w-4 text-slate-400 mr-2" />
                                        <input
                                            type="text"
                                            className="w-full text-sm outline-none"
                                            placeholder="Search patient by name or ID..."
                                            value={patientQuery}
                                            onChange={(e) => {
                                                setPatientQuery(e.target.value);
                                                setShowPatientResults(true);
                                                setSelectedPatient(null); // Clear selection on type
                                            }}
                                            onFocus={() => setShowPatientResults(true)}
                                        />
                                        {selectedPatient && (
                                            <div className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded font-bold flex items-center">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Selected
                                            </div>
                                        )}
                                    </div>

                                    {showPatientResults && patientQuery && !selectedPatient && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                            {filteredPatients.length === 0 ? (
                                                <div className="p-3 text-sm text-slate-500">No patients found.</div>
                                            ) : (
                                                filteredPatients.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                                                        onClick={() => {
                                                            setSelectedPatient(p);
                                                            setPatientQuery(p.name);
                                                            setShowPatientResults(false);
                                                        }}
                                                    >
                                                        <div>
                                                            <p className="font-medium text-sm text-slate-900">{p.name}</p>
                                                            <p className="text-xs text-slate-500">{p.age} Y / {p.gender}</p>
                                                        </div>
                                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{p.id}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Select Tests</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tests..."
                                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                    {filteredTests.map((test) => (
                                        <div
                                            key={test.id}
                                            onClick={() => toggleTest(test)}
                                            className={`
                                                flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                                                ${selectedTests.find(t => t.id === test.id)
                                                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                                            `}
                                        >
                                            <div>
                                                <p className="font-medium text-sm text-slate-900">{test.name}</p>
                                                <p className="text-xs text-slate-500">{test.category}</p>
                                            </div>
                                            {selectedTests.find(t => t.id === test.id) ? (
                                                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                                            ) : (
                                                <Plus className="h-4 w-4 text-slate-400" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="space-y-6">
                        <Card className="bg-slate-50 border-slate-200">
                            <CardHeader>
                                <CardTitle>Request Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Patient</p>
                                        <p className="font-medium text-slate-900">{selectedPatient ? selectedPatient.name : 'No patient selected'}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Selected Tests</p>
                                            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-700">{selectedTests.length}</span>
                                        </div>

                                        {selectedTests.length === 0 ? (
                                            <p className="text-sm text-slate-400 italic">No tests selected yet.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {selectedTests.map((test) => (
                                                    <li key={test.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border border-slate-200 shadow-sm">
                                                        <span className="truncate pr-2">{test.name}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); toggleTest(test); }} className="text-slate-400 hover:text-red-500">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <Button className="w-full" onClick={handleSubmit} disabled={!selectedPatient || selectedTests.length === 0}>
                                            Submit Request
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};



export default LabRequest;
