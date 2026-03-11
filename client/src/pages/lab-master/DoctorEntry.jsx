import React, { useState, useEffect } from 'react';
import { Plus, Stethoscope, Save, RefreshCw, X, Pencil, Trash2, Loader2 } from 'lucide-react'; // Added icons
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const DoctorEntry = () => {
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const initialFormState = {
        docId: '',
        docName: '',
        hospitalName: '',
        percentage: '',
        testName: 'All'
    };
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null); // id (PK) of the doctor being edited

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/lab/doctors');
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
            } else {
                console.error("Failed to fetch doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.docName || !formData.docId) {
            alert("Please fill required fields (Doctor ID, Name)");
            return;
        }

        setSubmitLoading(true);
        try {
            const url = editingId ? `/api/lab/doctors/${editingId}` : '/api/lab/doctors';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await fetchDoctors();
                resetForm();
                if (!editingId) { // Only checking this for cleaner UX on create
                    // maybe confirm?
                }
            } else {
                alert("Operation failed");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (doctor) => {
        setEditingId(doctor.id);
        setFormData({
            docId: doctor.docId,
            docName: doctor.docName,
            hospitalName: doctor.hospitalName,
            percentage: doctor.percentage,
            testName: doctor.testName
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;

        try {
            const res = await fetch(`/api/lab/doctors/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchDoctors();
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctor Entry</h1>
                        <p className="text-slate-500">Manage referral doctors and commission details.</p>
                    </div>
                    <Button
                        onClick={() => { setIsFormOpen(!isFormOpen); if (!isFormOpen) resetForm(); }}
                        className={`gap-2 ${isFormOpen ? 'bg-slate-100 text-slate-700' : 'bg-primary-600 text-white'}`}
                    >
                        {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isFormOpen ? 'Close Form' : 'New Doctor'}
                    </Button>
                </div>

                {isFormOpen && (
                    <Card className="border-primary-100 shadow-md">
                        <CardHeader className="bg-primary-50/50 border-b border-primary-100 pb-3">
                            <CardTitle className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-primary-600" />
                                {editingId ? 'Update Doctor Details' : 'New Doctor Details'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Doctor ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="docId"
                                        value={formData.docId}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-slate-300 focus:border-primary-500 focus:ring-primary-500 text-sm shadow-sm"
                                        placeholder="e.g. DOC001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Doctor Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="docName"
                                        value={formData.docName}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-slate-300 focus:border-primary-500 focus:ring-primary-500 text-sm shadow-sm"
                                        placeholder="Dr. Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Test Name Filter</label>
                                    <select
                                        name="testName"
                                        value={formData.testName}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-slate-300 focus:border-primary-500 focus:ring-primary-500 text-sm shadow-sm"
                                    >
                                        <option value="All">All</option>
                                        <option value="X-Ray">X-Ray</option>
                                        <option value="Scan">Scan</option>
                                        <option value="Blood Test">Blood Test</option>
                                        <option value="Urine Test">Urine Test</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Hospital Name</label>
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={formData.hospitalName}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-slate-300 focus:border-primary-500 focus:ring-primary-500 text-sm shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Percentage (%)</label>
                                    <input
                                        type="number"
                                        name="percentage"
                                        value={formData.percentage}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-slate-300 focus:border-primary-500 focus:ring-primary-500 text-sm shadow-sm"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitLoading}
                                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200"
                                >
                                    {submitLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {editingId ? 'Update Button' : 'Submit'} {/* Match image text roughly, defaulting to Submit/Update */}
                                </Button>
                                {editingId && (
                                    <Button onClick={resetForm} variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50">
                                        Cancel Edit
                                    </Button>
                                )}
                                <Button onClick={() => setIsFormOpen(false)} variant="ghost" className="text-slate-500 ml-auto">
                                    Close
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                        <CardTitle className="text-sm text-slate-600">Registered Doctors</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto rounded-b-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 border-b">ID</th>
                                    <th className="px-6 py-3 border-b">Doctor ID</th>
                                    <th className="px-6 py-3 border-b">Doctor Name</th>
                                    <th className="px-6 py-3 border-b">Hospital</th>
                                    <th className="px-6 py-3 border-b">Specialty/Test</th>
                                    <th className="px-6 py-3 border-b">Percentage</th>
                                    <th className="px-6 py-3 border-b text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-slate-500">Loading...</td>
                                    </tr>
                                ) : doctors.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-slate-400">No doctors found.</td>
                                    </tr>
                                ) : (
                                    doctors.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{doc.id}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{doc.docId}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{doc.docName}</td>
                                            <td className="px-6 py-4 text-slate-600">{doc.hospitalName}</td>
                                            <td className="px-6 py-4 text-slate-600">{doc.testName}</td>
                                            <td className="px-6 py-4 text-slate-900 font-bold">{doc.percentage}%</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-primary-600 hover:bg-primary-50 h-8 w-8 p-0 grid place-items-center rounded-full"
                                                    onClick={() => handleEdit(doc)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600 hover:bg-red-50 h-8 w-8 p-0 grid place-items-center rounded-full"
                                                    onClick={() => handleDelete(doc.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </PageTransition>
    );
};

export default DoctorEntry;
