import React, { useState } from 'react';
import { Search, Printer, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import PageTransition from '../../../components/layout/PageTransition';
import PatientHistoryPrint from '../../../components/print/PatientHistoryPrint';

const PatientHistory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [reportData, setReportData] = useState(null);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            // 1. Search for Patient
            const resPatients = await fetch(`/api/patients?search=${searchQuery}`);
            const patientsList = await resPatients.json();

            if (Array.isArray(patientsList) && patientsList.length > 0) {
                const patient = patientsList[0]; // Take best match

                // 2. Fetch Prescriptions for this patient
                // We use the patient's ID (cusId or SNo)
                // Note: Prescriptions use cusId usually.
                const searchId = patient.id || patient.sno;

                const resRx = await fetch(`/api/prescriptions/patient/${searchId}`);
                const rxList = await resRx.json();

                // 3. Find latest prescription for Vitals & Meds
                const latestRx = Array.isArray(rxList) && rxList.length > 0 ? rxList[0] : null;

                setReportData({
                    patientName: patient.name,
                    patientId: patient.id,
                    age: patient.age || latestRx?.age || '', // Fallback to Rx data if patient profile incomplete
                    gender: patient.gender || latestRx?.gender || '',
                    mobile: patient.phone || patient.mobile || '',
                    bloodGroup: patient.bloodGroup || '',
                    temp: latestRx?.vitals?.temp || '',
                    bp: latestRx?.vitals?.bp || '',
                    remarks: latestRx?.diagnosis || latestRx?.notes || 'Patient history report generated.',
                    prescriptions: latestRx?.medicines || []
                });
            } else {
                setReportData(null);
            }

        } catch (err) {
            console.error(err);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-7xl mx-auto pb-20">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient History Report</h1>
                        <p className="text-slate-500">Search for a patient to generate their history report.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Search Bar */}
                    <Card className="w-full">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Enter Patient Name or ID..."
                                        className="w-full pl-9 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <Button type="submit" className="bg-blue-600 text-white shadow-md">
                                    View Report
                                </Button>
                            </form>
                        </CardHeader>
                    </Card>

                    {/* Report Output Area */}
                    <div className="min-h-[500px] bg-slate-100/50 rounded-xl p-8 border border-slate-200 flex flex-col items-center">
                        {!searched ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                                <Search className="h-16 w-16 mb-4 opacity-20" />
                                <p>Enter patient details to view the report.</p>
                            </div>
                        ) : loading ? (
                            <div className="mt-20 text-slate-500 flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Loading Report Data...
                            </div>
                        ) : !reportData ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                                <AlertCircle className="h-16 w-16 mb-4 opacity-20" />
                                <p>No records found for "{searchQuery}".</p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
                                {/* Action Bar */}
                                <div className="w-[210mm] flex justify-end mb-4">
                                    <Button onClick={handlePrint} variant="outline" className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 gap-2 shadow-sm">
                                        <Printer className="w-4 h-4" /> Print Report
                                    </Button>
                                </div>

                                {/* The Actual Report Component */}
                                <div>
                                    <PatientHistoryPrint data={reportData} searchQuery={searchQuery} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PatientHistory;
