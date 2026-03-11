import React from 'react';
import BillLogo from '../../assets/bill_logo.svg';

const InvoicePrint = React.forwardRef(({ data }, ref) => {
    // Fallback if data is missing
    const invoice = data || {
        id: '',
        invoice_date: '',
        patient_name: '',
        category: '',
        items: [],
        total_amount: 0,
        paid_amount: 0,
        status: ''
    };

    // Helper to convert number to words
    const numberToWords = (num) => {
        if (!num) return '';
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return '';
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    };

    return (
        <div ref={ref} className="bg-white text-black font-sans p-8 max-w-[210mm] mx-auto text-sm leading-snug">
            {/* Header */}
            <div className="relative mb-4">
                <div className="text-right font-bold text-blue-900 text-sm mb-1">
                    Ph: +91-95009 79113
                </div>
                <div className="flex items-start gap-4 justify-between">
                    <div className="w-24 h-24 flex items-center justify-center">
                        <img src={BillLogo} className="w-full h-full object-contain" alt="Hospital Logo" />
                    </div>
                    <div className="flex-1 text-center">
                        <div className="border border-blue-900 px-4 py-1 mx-auto inline-block min-w-[300px]">
                            <h1 className="text-3xl font-bold text-blue-800 uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                                MITHREN'S HOSPITAL
                            </h1>
                        </div>
                        <div className="text-center font-semibold text-blue-900 mt-1">
                            ERODE- 637408.
                        </div>
                    </div>
                    <div className="w-16"></div>
                </div>
                <div className="text-center mt-2 text-blue-900">
                    <p className="font-bold text-sm">Dr. Mithren, M.B.B.S., M.S., FMAS, FIAGES, FALS.,</p>
                    <p className="font-semibold text-sm">Consultant General & Laparoscopic Surgeon</p>
                </div>
            </div>

            <div className="w-full h-0.5 bg-blue-900 my-2"></div>

            <h2 className="text-center font-bold text-blue-900 text-lg uppercase my-4">INVOICE / BILL</h2>

            {/* Patient Details */}
            <div className="flex justify-between items-start mb-6 px-2">
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <span className="font-bold w-24">Patient Name:</span>
                        <span className="border-b border-dotted border-slate-400 min-w-[200px] font-medium">{invoice.patient_name}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold w-24">Category:</span>
                        <span className="border-b border-dotted border-slate-400 min-w-[200px] font-medium">{invoice.category}</span>
                    </div>
                </div>
                <div className="space-y-2 text-right">
                    <div className="flex gap-2 justify-end">
                        <span className="font-bold">Invoice No:</span>
                        <span className="font-bold text-red-600">#{invoice.id}</span>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <span className="font-bold">Date:</span>
                        <span>{new Date(invoice.invoice_date || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <span className="font-bold">Status:</span>
                        <span className="uppercase">{invoice.status}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse border border-slate-900 mb-6">
                <thead>
                    <tr className="bg-slate-100 text-slate-900">
                        <th className="border border-slate-900 px-3 py-2 text-left w-12">#</th>
                        <th className="border border-slate-900 px-3 py-2 text-left">Description</th>
                        <th className="border border-slate-900 px-3 py-2 text-right w-24">Unit Price</th>
                        <th className="border border-slate-900 px-3 py-2 text-center w-20">Qty</th>
                        <th className="border border-slate-900 px-3 py-2 text-right w-32">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="border border-slate-900 px-3 py-2 text-center">{idx + 1}</td>
                                <td className="border border-slate-900 px-3 py-2">{item.description}</td>
                                <td className="border border-slate-900 px-3 py-2 text-right">{parseFloat(item.unit_price).toFixed(2)}</td>
                                <td className="border border-slate-900 px-3 py-2 text-center">{item.quantity}</td>
                                <td className="border border-slate-900 px-3 py-2 text-right font-bold">{parseFloat(item.total || (item.quantity * item.unit_price)).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="border border-slate-900 px-3 py-8 text-center text-slate-500">No items found</td>
                        </tr>
                    )}
                    {/* Empty row filler if needed */}
                </tbody>
            </table>

            {/* Footer Totals */}
            <div className="flex justify-between items-start border-t border-slate-900 pt-4">
                <div className="max-w-[60%]">
                    <p className="font-bold text-sm mb-1">Amount in Words:</p>
                    <p className="italic text-slate-700 capitalize">
                        {numberToWords(Math.round(invoice.total_amount))} Only
                    </p>
                </div>
                <div className="w-[300px]">
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Subtotal:</span>
                        <span>{parseFloat(invoice.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-emerald-700">
                        <span className="font-medium">Paid Amount:</span>
                        <span>- {parseFloat(invoice.paid_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-300 my-2"></div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Balance Due:</span>
                        <span className={(invoice.total_amount - (invoice.paid_amount || 0)) > 0 ? "text-red-600" : "text-emerald-600"}>
                            {Math.max(0, parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount || 0)).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-16 flex justify-between px-8 text-center text-xs text-slate-500 font-medium">
                <div>
                    <div className="mb-8">__________________________</div>
                    <p>Receptionist Signature</p>
                </div>
                <div>
                    <div className="mb-8">__________________________</div>
                    <p>Authorized Signature</p>
                </div>
            </div>
        </div>
    );
});

export default InvoicePrint;
