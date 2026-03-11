import React, { useState } from 'react';
import {
    Search, User, Calendar, Plus, Trash2,
    Save, Printer, FileText, Activity, Lock, AlertTriangle, FileDown, Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const Prescription = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    // Mock Patients List for Sidebar
    const patients = [
        { id: '1004', name: 'Elango', mobile: '91235784...', age: 12, gender: 'Male' },
        { id: '1003', name: 'Kumar', mobile: '95009791...', age: 30, gender: 'Male' },
        { id: '1002', name: 'Guna', mobile: '80563778...', age: 27, gender: 'Male' },
        { id: '1001', name: 'Surya', mobile: '95009791...', age: 25, gender: 'Male' },
    ];

    const [selectedPatient, setSelectedPatient] = useState(patients[0]);
    const [medicines, setMedicines] = useState([
        { id: 1, name: 'Paracetamol 500mg', qty: 10, food: 'After Food', m: true, n: false, e: false, ni: true, days: 5 }
    ]);
    const [vitals, setVitals] = useState({
        bp: '120/80',
        temp: '98.6',
        weight: '70',
        disease: 'Viral Fever',
        note: 'Patient advises complete rest for 2 days.'
    });

    const handleAddMedicine = () => {
        setMedicines([...medicines, {
            id: medicines.length + 1,
            name: '', qty: 0, food: 'After Food',
            m: false, n: false, e: false, ni: false, days: 0
        }]);
    };

    const handleRemoveMedicine = (id) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    const handleMedicineChange = (id, field, value) => {
        setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    return (
        <PageTransition>
            <div className="flex h-[calc(100vh-8rem)] gap-6">

                {/* LEFT SIDEBAR: Patient List */}
                <Card className="w-1/4 h-full flex flex-col">
                    <CardHeader className="border-b border-slate-100 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search Patient..."
                                className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto">
                        {patients.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${selectedPatient?.id === p.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold text-sm ${selectedPatient?.id === p.id ? 'text-primary-900' : 'text-slate-900'}`}>{p.name}</h4>
                                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{p.id}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{p.mobile}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* RIGHT SIDE: Prescription Form */}
                <div className="w-3/4 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">

                    {/* ADMIN: Immutable Banner */}
                    {isAdmin && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r shadow-sm flex items-start gap-4">
                            <div className="bg-amber-100 p-2 rounded-full shrink-0">
                                <Lock className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                                <h3 className="text-amber-900 font-bold text-sm uppercase tracking-wide">Clinical Data is Immutable</h3>
                                <p className="text-amber-700 text-sm mt-1">
                                    You are in <span className="font-bold">Admin Audit Mode</span>. Medical records, prescriptions, and dosage information are locked to preserve clinical integrity.
                                    Only authorized medical staff can modify this data.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Patient Details Header */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 hidden">
                            <CardTitle>Prescription Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase">Patient Name</label>
                                    <p className="text-lg font-bold text-slate-900">{selectedPatient.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase">Age / Gender</label>
                                    <p className="font-medium text-slate-900">{selectedPatient.age} Yrs / {selectedPatient.gender}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase">Date</label>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-2 col-span-1">
                                    {isAdmin ? (
                                        <>
                                            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50 gap-2">
                                                <Flag className="h-4 w-4" /> Flag for Review
                                            </Button>
                                            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50 gap-2">
                                                <FileDown className="h-4 w-4" /> Download PDF
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                                                <Printer className="h-4 w-4 mr-2" /> Print
                                            </Button>
                                            <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-md">
                                                <Save className="h-4 w-4 mr-2" /> Save
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vitals Form */}
                    <Card>
                        <CardHeader className="py-3 bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Vitals & Diagnosis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    Blood Group {isAdmin && <Lock className="h-3 w-3 text-slate-400" />}
                                </label>
                                <select
                                    className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 ${isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                                    disabled={isAdmin}
                                >
                                    <option>O+ve</option>
                                    <option>A+ve</option>
                                    <option>B+ve</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    Temperature (F) {isAdmin && <Lock className="h-3 w-3 text-slate-400" />}
                                </label>
                                <input
                                    type="text"
                                    value={vitals.temp}
                                    onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                                    className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 ${isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                                    disabled={isAdmin}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    Blood Pressure {isAdmin && <Lock className="h-3 w-3 text-slate-400" />}
                                </label>
                                <input
                                    type="text"
                                    value={vitals.bp}
                                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                                    className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 ${isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                                    disabled={isAdmin}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    Weight (kg) {isAdmin && <Lock className="h-3 w-3 text-slate-400" />}
                                </label>
                                <input
                                    type="text"
                                    value={vitals.weight}
                                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                                    className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 ${isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                                    disabled={isAdmin}
                                />
                            </div>
                            <div className="col-span-4 space-y-2">
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    Clinical Diagnosis {isAdmin && <Lock className="h-3 w-3 text-slate-400" />}
                                </label>
                                <input
                                    type="text"
                                    value={vitals.disease}
                                    onChange={(e) => setVitals({ ...vitals, disease: e.target.value })}
                                    className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:ring-1 focus:ring-primary-500 ${isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                                    placeholder={isAdmin ? "" : "Enter disease or diagnosis..."}
                                    disabled={isAdmin}
                                />
                            </div>
                            <div className="col-span-4 space-y-2">
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    Doctor's Note {isAdmin && <Lock className="h-3 w-3 text-slate-400" />}
                                </label>
                                <textarea
                                    value={vitals.note}
                                    onChange={(e) => setVitals({ ...vitals, note: e.target.value })}
                                    className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:ring-1 focus:ring-primary-500 h-20 resize-none ${isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                                    placeholder={isAdmin ? "Restricted: Clinical Notes" : "Additional notes..."}
                                    disabled={isAdmin}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medicine Table */}
                    <Card className="flex-1">
                        <CardHeader className="py-3 bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Medicines {isAdmin && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 normal-case font-normal ml-2">Read-Only View</span>}
                            </CardTitle>
                            {!isAdmin && (
                                <Button size="sm" onClick={handleAddMedicine} className="gap-2">
                                    <Plus className="h-3 w-3" /> Add Medicine
                                </Button>
                            )}
                        </CardHeader>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 text-slate-600 font-semibold text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 w-1/3">Medicine Name</th>
                                        <th className="px-4 py-3 w-20">Qty</th>
                                        <th className="px-4 py-3 w-32">Instruction</th>
                                        <th className="px-4 py-3 text-center">Frequency (M-N-E-N)</th>
                                        <th className="px-4 py-3 w-20">Days</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {medicines.map((m) => (
                                        <tr key={m.id} className="group hover:bg-slate-50">
                                            <td className="p-3 pl-4">
                                                <input
                                                    type="text"
                                                    value={m.name}
                                                    onChange={(e) => handleMedicineChange(m.id, 'name', e.target.value)}
                                                    className={`w-full border-0 border-b border-dashed border-slate-300 focus:border-primary-500 focus:ring-0 px-0 py-1 bg-transparent placeholder-slate-400 font-medium ${isAdmin && 'cursor-not-allowed text-slate-500'}`}
                                                    placeholder={isAdmin ? "" : "Type medicine name..."}
                                                    disabled={isAdmin}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    value={m.qty}
                                                    onChange={(e) => handleMedicineChange(m.id, 'qty', e.target.value)}
                                                    className={`w-full bg-transparent border border-slate-200 rounded px-2 py-1 text-center ${isAdmin && 'bg-slate-100 cursor-not-allowed text-slate-500'}`}
                                                    disabled={isAdmin}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={m.food}
                                                    onChange={(e) => handleMedicineChange(m.id, 'food', e.target.value)}
                                                    className={`w-full bg-transparent border border-slate-200 rounded px-2 py-1 text-xs ${isAdmin && 'bg-slate-100 cursor-not-allowed text-slate-500'}`}
                                                    disabled={isAdmin}
                                                >
                                                    <option>Before Food</option>
                                                    <option>After Food</option>
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    {['m', 'n', 'e', 'ni'].map(t => (
                                                        <label key={t} className={`flex flex-col items-center gap-1 ${isAdmin ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                                            <span className="text-[10px] font-bold uppercase text-slate-400">{t === 'ni' ? 'N' : t.toUpperCase()}</span>
                                                            <input
                                                                type="checkbox"
                                                                checked={m[t]}
                                                                onChange={(e) => handleMedicineChange(m.id, t, e.target.checked)}
                                                                className="rounded text-primary-600 focus:ring-primary-500 border-slate-300 w-4 h-4 cursor-inherit"
                                                                disabled={isAdmin}
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    value={m.days}
                                                    onChange={(e) => handleMedicineChange(m.id, 'days', e.target.value)}
                                                    className={`w-full bg-transparent border border-slate-200 rounded px-2 py-1 text-center font-bold text-slate-700 ${isAdmin && 'bg-slate-100 cursor-not-allowed text-slate-500'}`}
                                                    disabled={isAdmin}
                                                />
                                            </td>
                                            <td className="p-3 text-center">
                                                {!isAdmin && (
                                                    <button
                                                        onClick={() => handleRemoveMedicine(m.id)}
                                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {medicines.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No medicines added. Click "Add Medicine" to start.
                                </div>
                            )}
                        </div>
                    </Card>

                </div>
            </div>
        </PageTransition>
    );
};

export default Prescription;
