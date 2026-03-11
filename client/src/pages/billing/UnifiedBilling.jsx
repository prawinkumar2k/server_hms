import React, { useState } from 'react';
import { Search, CreditCard, Droplets, BedDouble, Receipt, DollarSign, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import PageTransition from '../../components/layout/PageTransition';

import PatientSearch from '../../components/common/PatientSearch';

const UnifiedBilling = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const toast = useToast();

    const handleSearch = async (idOverride) => {
        const id = idOverride || searchTerm;
        if (!id) {
            toast.warning("Please enter Patient ID");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/pharmacy-billing/patient-financials/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPatientData(data);
                toast.success("Details fetched");
            } else {
                toast.error("Patient financials not found");
                setPatientData(null);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (bills) => bills.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Unified Patient Billing</h1>
                        <p className="text-slate-500">Consolidated financial view for Pharmacy, Lab, and Hospital stays.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1 w-full relative z-10">
                                <label className="text-sm font-bold text-slate-700">Search Patient</label>
                                <PatientSearch
                                    onSelect={(p) => {
                                        if (p) {
                                            setSearchTerm(p.patientId);
                                            // Trigger search immediately
                                            handleSearch(p.patientId);
                                        } else {
                                            setSearchTerm('');
                                            setPatientData(null);
                                        }
                                    }}
                                    placeholder="Search by Name, Mobile, or ID..."
                                />
                            </div>
                            {/* <Button size="lg" onClick={() => handleSearch(searchTerm)} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                                {loading ? 'Searching...' : 'Pull Records'}
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>

                {patientData && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Patient Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{patientData.patientName}</h2>
                                    <p className="text-slate-300 font-mono mt-1">ID: {patientData.patientId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total Outstanding</p>
                                    <h3 className="text-3xl font-bold text-emerald-400">₹ {(patientData.grandTotal).toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <CreditCard className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{patientData.pharmacyBills.length} Bills</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Pharmacy Charges</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">₹ {calculateTotal(patientData.pharmacyBills).toLocaleString()}</h3>
                                </CardContent>
                            </Card>

                            <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <Droplets className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{patientData.labBills.length} Bills</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Lab Charges</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">₹ {calculateTotal(patientData.labBills).toLocaleString()}</h3>
                                </CardContent>
                            </Card>

                            <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-emerald-50 rounded-lg">
                                            <BedDouble className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{patientData.hospitalBills.length} Bills</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Hospital Charges</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">₹ {calculateTotal(patientData.hospitalBills).toLocaleString()}</h3>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Tabs */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-slate-500" /> Recent Transactions
                            </h3>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Ref / Bill No</th>
                                            <th className="px-6 py-4">Details</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[...patientData.pharmacyBills, ...patientData.labBills, ...patientData.hospitalBills]
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                            .map((bill, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-slate-500">{new Date(bill.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${bill.type === 'Pharmacy' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            bill.type === 'Lab' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            }`}>
                                                            {bill.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-slate-600">#{bill.id}</td>
                                                    <td className="px-6 py-4 text-slate-700 font-medium">{bill.desc}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-slate-900">₹ {parseFloat(bill.amount).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        {[...patientData.pharmacyBills, ...patientData.labBills, ...patientData.hospitalBills].length === 0 && (
                                            <tr><td colSpan="5" className="text-center py-8 text-slate-400 italic">No billing records found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default UnifiedBilling;
