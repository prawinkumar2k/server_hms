import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const LabResults = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Lab Results Data
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // In a real scenario, we might have a specific endpoint for results
                // For now, reusing pending requests but filtering for COMPLETED in frontend or backend
                const res = await fetch('/api/lab/requests/pending?status=COMPLETED');
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (e) { console.error(e); }
        };
        fetchResults();
    }, []);

    const filteredResults = results.filter(r =>
        (r.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs font-semibold"><CheckCircle className="h-3 w-3" /> Ready</span>;
            case 'Pending': return <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs font-semibold"><Clock className="h-3 w-3" /> Pending</span>;
            case 'Processing': return <span className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-xs font-semibold"><Clock className="h-3 w-3" /> Processing</span>;
            default: return status;
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Results</h1>
                        <p className="text-slate-500">View and analyze patient diagnostic reports.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle>Recent Reports</CardTitle>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by patient or test..."
                                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Report ID</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Test Name</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredResults.map((req) => (
                                        <React.Fragment key={req.id}>
                                            {req.tests && req.tests.map((test, idx) => (
                                                <tr key={`${req.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-slate-500">
                                                        {req.id}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-900">{req.patient_name}</td>
                                                    <td className="px-6 py-4">{test.test_name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{new Date(req.request_date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(test.status || 'Pending')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {test.status === 'COMPLETED' ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                                onClick={() => navigate('/lab-entry/report', {
                                                                    state: {
                                                                        searchCoords: {
                                                                            testId: test.report_id,
                                                                            patientId: req.patient_id
                                                                        }
                                                                    }
                                                                })}
                                                            >
                                                                <FileText className="h-4 w-4 mr-2" /> View Report
                                                            </Button>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs italic">Processing</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    );
};

export default LabResults;
