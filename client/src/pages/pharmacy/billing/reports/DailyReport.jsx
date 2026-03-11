import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
    Printer, Download, Calendar,
    FileText, CheckCircle2, Building2
} from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Card, CardContent } from '../../../../components/common/Card';

const DailySalesLimit = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    // For Printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Pharmacy_Daily_Report_${date}`,
    });

    useEffect(() => {
        fetchReport();
    }, [date]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/pharmacy/reports/daily?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setReportData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/reports/generate?type=pharmacy-billing&date=${date}`, {
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    // Assuming static Organization Data for now
    const orgData = {
        name: "CITY HOSPITAL PHARMACY",
        address: "123, Health Avenue, Medical District, Mumbai - 400001",
        license: "DL-2024-MH-987654",
        gst: "GSTIN: 27ABCDE1234F1Z5",
        phone: "+91 98765 43210"
    };

    if (!reportData) return <div className="p-8 text-center text-slate-500">Loading Report...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Daily Sales Report</h1>
                        <p className="text-xs text-slate-500">Generate legal daily sales records</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50 gap-2">
                        <Printer className="w-4 h-4" /> Quick Print
                    </Button>
                    <Button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        <FileText className="w-4 h-4" /> Download Official PDF
                    </Button>
                </div>
            </div>

            {/* Printable Report Content */}
            <div className="printable-content bg-white shadow-lg rounded-none mx-auto w-full print:shadow-none" ref={componentRef}>
                <div className="p-10 space-y-6 print:p-0">

                    {/* Report Header */}
                    <div className="border-b-2 border-slate-800 pb-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="text-left">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide mb-1">{orgData.name}</h2>
                                <p className="text-slate-600 font-medium text-sm">{orgData.address}</p>
                                <p className="text-slate-600 text-sm mt-1 flex gap-4">
                                    <span>License: <span className="font-bold text-slate-800">{orgData.license}</span></span>
                                    <span>{orgData.gst}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Report Date</p>
                                <p className="text-xl font-bold text-indigo-600">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards (For Print) */}
                    <div className="grid grid-cols-4 gap-4 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                        <div className="p-4 border-r border-slate-200 text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Sales</p>
                            <p className="text-xl font-black text-slate-900">{formatCurrency(reportData.summary.revenue)}</p>
                        </div>
                        <div className="p-4 border-r border-slate-200 text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Bills</p>
                            <p className="text-xl font-black text-slate-900">{reportData.summary.totalBills}</p>
                        </div>
                        <div className="p-4 border-r border-slate-200 text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Cash</p>
                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(reportData.summary.cash)}</p>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Digital</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrency(reportData.summary.card + reportData.summary.upi)}</p>
                        </div>
                    </div>

                    {/* Report Table */}
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left border border-slate-200">
                            <thead className="text-xs text-white uppercase bg-slate-800 print:bg-slate-800 print:text-white">
                                <tr>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-16 text-center">No.</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24">Date</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600">Patient Details</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600">Items Prescribed</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24 text-center">Mode</th>
                                    <th className="px-4 py-3 font-bold text-right w-32">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {reportData.bills.map((bill, idx) => (
                                    <tr key={idx} className="bg-white border-b border-slate-200 print:break-inside-avoid">
                                        <td className="px-4 py-3 font-medium text-center border-r border-slate-100">{bill.billNo}</td>
                                        <td className="px-4 py-3 text-slate-600 border-r border-slate-100 text-xs">
                                            {new Date(bill.date).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3 border-r border-slate-100">
                                            <p className="font-bold text-slate-800 text-xs uppercase">{bill.patientName}</p>
                                            <p className="text-[10px] text-slate-500">{bill.mobileNo || 'N/A'}</p>
                                        </td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-xs text-slate-600">
                                            <div className="line-clamp-2 print:line-clamp-none">
                                                {bill.items}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center border-r border-slate-100">
                                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 uppercase">
                                                {bill.paymentMode}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-900 border-l border-slate-100">
                                            {formatCurrency(bill.amount)}
                                        </td>
                                    </tr>
                                ))}
                                {reportData.bills.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                                            No billing records found for this date.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-800">
                                <tr>
                                    <td colSpan="5" className="px-4 py-3 text-right text-slate-800 uppercase text-xs tracking-wider">Total Sales Revenue</td>
                                    <td className="px-4 py-3 text-right text-indigo-700 text-lg">
                                        {formatCurrency(reportData.summary.revenue)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Report Footer */}
                    <div className="mt-12 flex justify-between items-end pt-8 border-t border-slate-200 break-inside-avoid">
                        <div className="text-xs text-slate-400">
                            <p>This is a computer generated report.</p>
                            <p>Generated on {new Date().toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-48 border-b border-slate-300 mb-2"></div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailySalesLimit;
