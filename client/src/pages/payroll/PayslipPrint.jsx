import React, { forwardRef } from 'react';

const PayslipPrint = forwardRef(({ payslip }, ref) => {
    if (!payslip) return null;

    return (
        <div ref={ref} className="bg-white p-8 w-[210mm] min-h-[148mm] mx-auto text-slate-900 font-sans border border-slate-200 shadow-sm print:shadow-none print:border-none">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-900 text-white flex items-center justify-center rounded-lg">
                        <span className="font-bold text-2xl">HM</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900">Mithren's Hospital</h1>
                        <p className="text-sm text-slate-500">123, Health Avenue, Medical District, NY 10001</p>
                        <p className="text-sm text-slate-500">Phone: +1 234 567 890 | Email: hr@mithrenshospital.com</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-indigo-900 uppercase tracking-widest">Payslip</h2>
                    <p className="text-sm font-medium text-slate-600">{new Date(0, payslip.month - 1).toLocaleString('default', { month: 'long' })} {payslip.year}</p>
                </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Employee Name</span>
                        <span className="font-bold">{payslip.first_name} {payslip.last_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Employee Code</span>
                        <span className="font-medium">{payslip.employee_code}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Department</span>
                        <span className="font-medium">{payslip.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Designation</span>
                        <span className="font-medium">{payslip.designation}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Total Days</span>
                        <span className="font-medium">{payslip.total_days}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Days Paid</span>
                        <span className="font-medium">{payslip.days_present + payslip.days_leave}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Days Absent (LOP)</span>
                        <span className="font-medium text-rose-600">{payslip.days_absent}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Generated On</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Salary Breakdown */}
            <div className="mb-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 border-y border-slate-200">
                            <th className="py-2 pl-4 text-left w-1/2">Earnings</th>
                            <th className="py-2 text-right w-1/4">Amount</th>
                            <th className="py-2 pl-4 text-left w-1/4">Deductions</th>
                            <th className="py-2 pr-4 text-right w-1/4">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="py-2 pl-4">Basic Salary</td>
                            <td className="py-2 text-right">₹{Number(payslip.basic_salary).toLocaleString()}</td>
                            <td className="py-2 pl-4 border-l border-slate-100">Provident Fund</td>
                            <td className="py-2 pr-4 text-right">₹0.00</td> {/* Need to fetch actual breakdown if stored */}
                        </tr>
                        <tr>
                            <td className="py-2 pl-4">HRA</td>
                            <td className="py-2 text-right">₹{Number(payslip.hra).toLocaleString()}</td>
                            <td className="py-2 pl-4 border-l border-slate-100">ESI</td>
                            <td className="py-2 pr-4 text-right">₹0.00</td>
                        </tr>
                        <tr>
                            <td className="py-2 pl-4">Allowances</td>
                            <td className="py-2 text-right">₹{Number(payslip.allowances).toLocaleString()}</td>
                            <td className="py-2 pl-4 border-l border-slate-100">Prof. Tax</td>
                            <td className="py-2 pr-4 text-right">₹{Number(payslip.total_deductions).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="py-2 pl-4 text-rose-600">Less: Loss of Pay</td>
                            <td className="py-2 text-right text-rose-600">- ₹{Number(payslip.loss_of_pay).toLocaleString()}</td>
                            <td className="py-2 pl-4 border-l border-slate-100"></td>
                            <td className="py-2 pr-4 text-right"></td>
                        </tr>
                        {/* Totals */}
                        <tr className="bg-slate-100 font-bold border-t border-slate-300">
                            <td className="py-3 pl-4">Gross Earnings</td>
                            <td className="py-3 text-right">₹{Number(payslip.gross_earnings).toLocaleString()}</td>
                            <td className="py-3 pl-4 border-l border-slate-200">Total Deductions</td>
                            <td className="py-3 pr-4 text-right">₹{Number(payslip.total_deductions).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Net Pay */}
            <div className="flex justify-end items-center gap-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg mb-8">
                <div className="text-right">
                    <p className="text-sm text-emerald-600 font-medium uppercase tracking-wide">Net Payable</p>
                    <p className="text-3xl font-bold text-emerald-800">₹{Number(payslip.net_salary).toLocaleString()}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-slate-200">
                <div className="text-center">
                    <p className="font-bold text-slate-900">Employer Signature</p>
                    <p className="text-xs text-slate-400 mt-1">Authorized Signatory</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-slate-900">Employee Signature</p>
                    <p className="text-xs text-slate-400 mt-1">Received & Accepted</p>
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-slate-400">
                <p>This is a system generated payslip. Any discrepancies should be reported to HR within 3 working days.</p>
            </div>
        </div>
    );
});

export default PayslipPrint;
