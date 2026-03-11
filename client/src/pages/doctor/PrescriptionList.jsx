import React, { useState, useEffect } from 'react';
import { Search, Filter, Pill, FileText, Calendar, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';

const PrescriptionList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/prescriptions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPrescriptions(data);
                } else {
                    console.error("API returned non-array:", data);
                    setPrescriptions([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setPrescriptions([]);
                setLoading(false);
            });
    }, []);

    const filteredPrescriptions = prescriptions.filter(rx =>
        (rx.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rx.patientId || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Prescriptions</h1>
                        <p className="text-slate-500">History of all patient prescriptions and medications.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle>Prescription History</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search patient name or ID..."
                                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Filter className="h-4 w-4 text-slate-500" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Diagnosis</th>
                                        <th className="px-6 py-4">Medicines Count</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-10">Loading prescriptions...</td></tr>
                                    ) : filteredPrescriptions.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-10 text-slate-500">No prescriptions found.</td></tr>
                                    ) : (
                                        filteredPrescriptions.map((rx, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    <div>{rx.patientName}</div>
                                                    <div className="text-xs text-slate-400">ID: {rx.patientId}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{rx.date}</td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold border border-blue-100">
                                                        {rx.diagnosis || "General"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {rx.medicines.length} Medicines
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/doctor/notes/${rx.patientId}`)}>
                                                        <Eye className="h-4 w-4 text-slate-400 hover:text-primary-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    );
};

export default PrescriptionList;
