import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, User, Calendar, Activity, Plus, FilePlus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const MedicalRecords = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [view, setView] = useState('list'); // 'list' | 'detail' | 'create'
    const [newRecord, setNewRecord] = useState({
        symptoms: '', diagnosis: '', plan: '', visitDate: new Date().toISOString().split('T')[0]
    });
    const [isSearching, setIsSearching] = useState(false);

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Debounced live search for suggestions
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/lab/patients?term=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation for suggestions
    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelectSuggestion(suggestions[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (patient) => {
        setSearchQuery(patient.patientName);
        setShowSuggestions(false);
        setPatients([patient]);
        handleSelectPatient(patient);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        try {
            const res = await fetch(`/api/lab/patients?term=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setPatients(data);
        } catch (err) {
            console.error(err);
            setPatients([]);
        }
    };

    const handleSelectPatient = async (patient) => {
        setSelectedPatient(patient);
        setView('detail');
        // Fetch specific medical records
        try {
            const res = await fetch(`/api/medical-records/${patient.patientId}`);
            const data = await res.json();
            setRecords(data);
        } catch (err) {
            console.error("Failed to load records", err);
            setRecords([]);
        }
    };

    const handleSaveRecord = async () => {
        if (!selectedPatient) return;
        try {
            const payload = {
                patientId: selectedPatient.patientId,
                doctorId: 'CurrentDoc', // Should come from context
                ...newRecord
            };
            const res = await fetch('/api/medical-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert('Record saved');
                setView('detail');
                handleSelectPatient(selectedPatient); // Refresh
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save');
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Records</h1>
                        <p className="text-slate-500">Access and manage patient clinical history.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                    {/* Sidebar List */}
                    <Card className="lg:col-span-4 h-full flex flex-col">
                        <CardHeader className="p-4 border-b border-slate-100 bg-slate-50">
                            <div ref={searchRef} className="relative">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    {isSearching && (
                                        <div className="absolute right-3 top-2.5">
                                            <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                                        </div>
                                    )}
                                    <input
                                        ref={inputRef}
                                        className="w-full pl-9 pr-10 h-10 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Search by Name, ID..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                        autoComplete="off"
                                    />
                                </form>

                                {/* Autocomplete Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 max-h-64 overflow-y-auto">
                                        {suggestions.map((patient, index) => (
                                            <div
                                                key={patient.patientId}
                                                onClick={() => handleSelectSuggestion(patient)}
                                                className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0 ${highlightedIndex === index
                                                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                                        : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {patient.patientName?.charAt(0)?.toUpperCase() || 'P'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">{patient.patientName}</p>
                                                        <p className="text-xs text-slate-500">
                                                            ID: {patient.patientId} • {patient.mobile || 'No phone'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No results message */}
                                {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && !isSearching && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-50">
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>No patients found for "{searchQuery}"</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                            {patients.length === 0 ? (
                                <div className="text-center p-8 text-slate-400 text-sm">
                                    No patients found. Search to begin.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {patients.map(p => (
                                        <div
                                            key={p.patientId}
                                            onClick={() => handleSelectPatient(p)}
                                            className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedPatient?.patientId === p.patientId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                        >
                                            <div className="font-bold text-slate-900">{p.patientName}</div>
                                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                <span>ID: {p.patientId}</span>
                                                <span>{p.mobile}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Main Content Area */}
                    <Card className="lg:col-span-8 h-full flex flex-col bg-slate-50/50">
                        {view === 'list' && !selectedPatient && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <FileText className="h-16 w-16 mb-4 opacity-20" />
                                <p>Select a patient to view records</p>
                            </div>
                        )}

                        {view === 'detail' && selectedPatient && (
                            <div className="flex flex-col h-full">
                                <CardHeader className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{selectedPatient.patientName}</h2>
                                        <p className="text-sm text-slate-500">ID: {selectedPatient.patientId} | Age: {selectedPatient.age} | Sex: {selectedPatient.sex}</p>
                                    </div>
                                    <Button onClick={() => setView('create')} className="bg-blue-600 text-white gap-2">
                                        <Plus className="h-4 w-4" /> New Record
                                    </Button>
                                </CardHeader>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {records.length === 0 ? (
                                        <div className="text-center text-slate-400 py-10">No prior records found.</div>
                                    ) : (
                                        records.map(rec => (
                                            <div key={rec.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                                                <div className="absolute top-4 right-4 text-xs font-mono text-slate-400">
                                                    {new Date(rec.visit_date).toLocaleDateString()}
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis</span>
                                                        <p className="font-bold text-slate-900 text-lg">{rec.diagnosis || 'Unspecified'}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="font-semibold text-slate-600">Symptoms:</span>
                                                            <p className="text-slate-800">{rec.symptoms || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-600">Plan:</span>
                                                            <p className="text-slate-800">{rec.treatment_plan || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {view === 'create' && (
                            <div className="flex flex-col h-full bg-white">
                                <CardHeader className="bg-white border-b border-slate-200 p-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <FilePlus className="h-5 w-5 text-blue-600" />
                                        New Clinical Note
                                    </h2>
                                </CardHeader>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                                        <input
                                            className="w-full border p-2 rounded"
                                            value={newRecord.diagnosis}
                                            onChange={e => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms (Complaints)</label>
                                        <textarea
                                            className="w-full border p-2 rounded h-24"
                                            value={newRecord.symptoms}
                                            onChange={e => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Plan / Notes</label>
                                        <textarea
                                            className="w-full border p-2 rounded h-32"
                                            value={newRecord.plan}
                                            onChange={e => setNewRecord({ ...newRecord, plan: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <Button className="bg-blue-600 text-white" onClick={handleSaveRecord}>Save Record</Button>
                                        <Button variant="outline" onClick={() => setView('detail')}>Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </PageTransition>
    );
};

export default MedicalRecords;
