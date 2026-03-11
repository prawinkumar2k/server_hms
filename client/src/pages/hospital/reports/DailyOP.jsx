import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Calendar, FileText, Filter } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import PageTransition from '../../../components/layout/PageTransition';
import BoldReportViewer from '../../../components/BoldReportViewer';

const DailyOPReport = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('OPD'); // Default to OPD, allow all

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Hospital_Daily_Report_${date}`,
    });

    useEffect(() => {
        fetchReport();
    }, [date]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/daily-op?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setReportData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/reports/generate?type=op-daily&date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to generate PDF');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("PDF Download failed", error);
            alert("Failed to download PDF. Please try again.");
        }
    };

    const filteredData = reportData.filter(item => {
        if (filterCategory === 'All') return true;
        if (filterCategory === 'OPD') {
            return ['OPD', 'OPD Visit', 'Consultation'].includes(item.category);
        }
        return item.category === filterCategory;
    });

    const totalCollection = filteredData.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || 0), 0);
    const totalBilled = filteredData.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);

    // Organization Data (Hardcoded for now, could be dynamic later)
    const orgData = {
        name: "MITHREN'S HOSPITAL",
        address: "ERODE - 637408",
        phone: "+91 95009 79113",
        doctor: "Dr. Mithren, M.B.B.S., M.S., FMAS, FIAGES, FALS.,",
        doctor_prof: "Consultant General & Laparoscopic Surgeon"
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1400px] mx-auto pb-20">
                {/* Control Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Daily Revenue Report</h1>
                            <p className="text-xs text-slate-500">Hospital Billing Records</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                            <option value="All">All Categories</option>
                            <option value="OPD">OPD Only</option>
                            <option value="IPD">IPD Only</option>
                            <option value="General">General</option>
                        </select>
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-3 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <Button onClick={handlePrint} variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50 gap-2">
                            <span className="w-4 h-4">🖨️</span> Print Report
                        </Button>
                        <Button onClick={fetchReport} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Report Content - Visible on Screen & Printable */}
                <div id="report-print" className="printable-content bg-white shadow-lg mx-auto w-[210mm] min-h-[297mm] p-8 print:p-0 print:shadow-none print:w-full" ref={componentRef}>
                    <div className="flex flex-col h-full bg-white relative">
                        {/* Header Section */}
                        <div className="relative mb-6">
                            {/* Phone Top Right */}
                            <div className="absolute top-0 right-0 text-right">
                                <p className="text-blue-900 font-bold text-sm">Ph: +91-95009 79113</p>
                            </div>

                            {/* Logo Left - Using a placeholder icon since we don't have the image file */}
                            <div className="absolute top-2 left-0 w-24 h-24 flex items-center justify-center">
                                {/* <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" /> */}
                                <div className="text-blue-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
                                        <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" />
                                        <path d="M12 6C8 6 8 2 8 2" stroke="currentColor" />
                                        <path d="M12 6C16 6 16 2 16 2" stroke="currentColor" />
                                    </svg>
                                </div>
                            </div>

                            {/* Hospital Name Box */}
                            <div className="flex flex-col items-center justify-center pt-8">
                                <div className="border-2 border-blue-900 px-6 py-2 mb-1">
                                    <h1 className="text-3xl font-bold text-blue-900 uppercase tracking-wide">MITHREN'S HOSPITAL</h1>
                                </div>
                                <p className="text-blue-900 font-medium text-sm mb-2">ERODE- 637408.</p>

                                <div className="text-center text-blue-900 text-sm font-medium leading-tight">
                                    <p>Dr. Mithren, M.B.B.S., M.S., FMAS, FIAGES, FALS.,</p>
                                    <p>Consultant General & Laparoscopic Surgeon</p>
                                </div>
                            </div>

                            {/* Separator Line */}
                            <div className="w-full h-0.5 bg-blue-900 mt-4"></div>
                        </div>

                        {/* Report Title */}
                        <div className="text-center mb-8">
                            <h2 className="text-lg font-bold text-black uppercase tracking-wider">OP REPORT</h2>
                        </div>

                        {/* Data Table */}
                        <div className="flex-grow">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left">
                                        <th className="font-bold text-red-900 pb-4 w-24 pl-4">ID</th>
                                        <th className="font-bold text-red-900 pb-4 pl-4">Patient Name</th>
                                        <th className="font-bold text-red-900 pb-4 text-center">Mobile No</th>
                                        <th className="font-bold text-red-900 pb-4 text-right pr-12">OP Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-900">
                                    {filteredData.map((record, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 print:hover:bg-transparent">
                                            <td className="py-2 pl-4 text-left font-medium">{record.id}</td>
                                            <td className="py-2 pl-4 text-left font-medium">{record.patient_name}</td>
                                            <td className="py-2 text-center">{record.mobile_no || '-'}</td>
                                            <td className="py-2 text-right pr-12 font-medium">{(parseFloat(record.op_fees) || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-400 italic">No records found for this date.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Totals */}
                        <div className="mt-8 mb-20 mr-12">
                            <div className="flex justify-end items-center mb-2">
                                <span className="font-bold text-blue-900 mr-12 text-sm">OP FEE</span>
                                <span className="font-bold text-black w-24 text-right">
                                    {(filteredData.reduce((sum, item) => sum + (parseFloat(item.op_fees) || 0), 0)).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className="font-bold text-blue-900 mr-12 text-sm">TOTAL FEE</span>
                                <span className="font-bold text-black w-24 text-right">
                                    {(filteredData.reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default DailyOPReport;
