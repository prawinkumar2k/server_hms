import React, { useState, useEffect, useRef } from 'react';
import { BadgeDollarSign, Calendar, Download, RefreshCw, Printer, X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import PayslipPrint from './PayslipPrint';

// Custom Confirmation Modal Component
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) => {
    if (!isOpen) return null;

    const iconConfig = {
        warning: { icon: AlertTriangle, bg: "bg-amber-100", color: "text-amber-600" },
        danger: { icon: XCircle, bg: "bg-red-100", color: "text-red-600" },
        success: { icon: CheckCircle, bg: "bg-emerald-100", color: "text-emerald-600" },
    };

    const { icon: Icon, bg, color } = iconConfig[type] || iconConfig.warning;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header with Icon */}
                <div className="p-6 pb-4 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${bg} mb-4`}>
                        <Icon className={`h-8 w-8 ${color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-slate-700 bg-white border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 text-white bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-200"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toast Notification Component
const Toast = ({ isOpen, message, type = "success", onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => onClose(), 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const config = {
        success: { icon: CheckCircle, bg: "bg-emerald-50", border: "border-emerald-200", color: "text-emerald-600" },
        error: { icon: XCircle, bg: "bg-red-50", border: "border-red-200", color: "text-red-600" },
    };

    const { icon: Icon, bg, border, color } = config[type] || config.success;

    return (
        <div className="fixed top-6 right-6 z-[110] animate-in slide-in-from-top-5 fade-in duration-300">
            <div className={`flex items-center gap-3 px-5 py-4 rounded-xl ${bg} ${border} border shadow-lg`}>
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-slate-700 font-medium">{message}</span>
                <button onClick={onClose} className="ml-2 p-1 hover:bg-white/50 rounded-full transition-colors">
                    <X className="h-4 w-4 text-slate-400" />
                </button>
            </div>
        </div>
    );
};

const PayslipPreviewModal = ({ payslip, onClose }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Payslip_${payslip.first_name}_${payslip.month}_${payslip.year}`,
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700">Payslip Preview</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center">
                    <div className="shadow-lg bg-white">
                        <PayslipPrint ref={componentRef} payslip={payslip} />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        <Printer className="h-4 w-4" /> Print Payslip
                    </Button>
                </div>
            </div>
        </div>
    );
};

const SalaryProcessing = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [viewPayslip, setViewPayslip] = useState(null);

    // Confirmation Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Toast Notification State
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

    useEffect(() => {
        fetchPayslips();
    }, [month, year]);

    const fetchPayslips = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/payroll/payslips?month=${month}&year=${year}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setPayslips(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // Show confirmation modal
    const handleRunPayrollClick = () => {
        setShowConfirmModal(true);
    };

    // Actual payroll generation after confirmation
    const handleGenerate = async () => {
        setShowConfirmModal(false);
        setProcessing(true);
        try {
            const res = await fetch('/api/payroll/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ month, year })
            });

            if (res.ok) {
                const result = await res.json();
                setToast({ isOpen: true, message: `Successfully processed ${result.count} payslips.`, type: 'success' });
                fetchPayslips();
            } else {
                setToast({ isOpen: true, message: 'Failed to generate payroll.', type: 'error' });
            }
        } catch (e) {
            console.error(e);
            setToast({ isOpen: true, message: 'An error occurred while generating payroll.', type: 'error' });
        }
        setProcessing(false);
    };

    // Helper for Month Name
    const getMonthName = (m) => new Date(0, m - 1).toLocaleString('default', { month: 'long' });

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tight">Payroll Processing</h1>
                        <p className="text-slate-500">Generate monthly payslips based on attendance and salary structure.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <select
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="bg-slate-50 border-none rounded-lg text-sm font-semibold focus:ring-0"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="bg-slate-50 border-none rounded-lg text-sm font-semibold focus:ring-0"
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        <Button
                            onClick={handleRunPayrollClick}
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${processing ? 'animate-spin' : ''}`} />
                            {processing ? 'Processing...' : 'Run Payroll'}
                        </Button>
                    </div>
                </div>

                {/* Payslip List */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4 text-center">Days Present</th>
                                        <th className="px-6 py-4 text-center">Loss of Pay</th>
                                        <th className="px-6 py-4 text-right">Gross Pay</th>
                                        <th className="px-6 py-4 text-right">Net Salary</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="7" className="p-12 text-center text-slate-400">Loading payslips...</td></tr>
                                    ) : payslips.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                                                <BadgeDollarSign className="h-8 w-8 text-slate-300" />
                                                <p>No payslips generated for {getMonthName(month)} {year}.</p>
                                                <Button variant="outline" size="sm" onClick={handleRunPayrollClick}>Run Payroll Now</Button>
                                            </td>
                                        </tr>
                                    ) : (
                                        payslips.map((slip) => (
                                            <tr key={slip.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-3">
                                                    <div className="font-bold text-slate-700">{slip.first_name} {slip.last_name}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{slip.employee_code} • {slip.department}</div>
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className="font-mono text-slate-600">{slip.days_present}</span>
                                                    <span className="text-xs text-slate-400"> / {slip.total_days}</span>
                                                </td>
                                                <td className="px-6 py-3 text-center font-mono text-rose-500">
                                                    {Number(slip.loss_of_pay) > 0 ? `-₹${Number(slip.loss_of_pay).toLocaleString()}` : '-'}
                                                </td>
                                                <td className="px-6 py-3 text-right font-mono text-slate-600">
                                                    ₹{Number(slip.gross_earnings).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-right font-bold text-emerald-600 font-mono text-base">
                                                    ₹{Number(slip.net_salary).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${slip.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                                        slip.status === 'Generated' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100'
                                                        }`}>
                                                        {slip.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setViewPayslip(slip)}
                                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                            title="Print Payslip"
                                                        >
                                                            <Printer className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Print Modal */}
                {viewPayslip && (
                    <PayslipPreviewModal
                        payslip={viewPayslip}
                        onClose={() => setViewPayslip(null)}
                    />
                )}

                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Generate Payroll"
                    message={`Are you sure you want to generate payroll for ${getMonthName(month)} ${year}? This will calculate salaries based on attendance records.`}
                    confirmText="Generate Payroll"
                    cancelText="Cancel"
                    type="warning"
                    onConfirm={handleGenerate}
                    onCancel={() => setShowConfirmModal(false)}
                />

                {/* Toast Notification */}
                <Toast
                    isOpen={toast.isOpen}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, isOpen: false })}
                />
            </div>
        </PageTransition>
    );
};

export default SalaryProcessing;
