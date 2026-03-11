import React from 'react';
import { Activity } from 'lucide-react';
import BillLogo from '../../assets/bill_logo.svg';

const PharmacyBillPrint = ({ data }) => {
    // Fallback if data is missing (for previewing layout without data)
    const billData = data || {
        billNo: '',
        billDate: '',
        customerName: '',
        address: '',
        items: [],
        totalAmount: 0,
        discount: 0,
        tax: 0,
        netAmount: 0
    };

    const {
        billNo,
        billDate,
        customerName,
        address,
        items,
        totalAmount,
        discount,
        tax,
        netAmount
    } = billData;

    // Helper to convert number to words (Simplified)
    const numberToWords = (num) => {
        if (!num) return '';
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return '';
        let str = '';
        str += (n[1] !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    };

    return (
        <div id="invoice-print" className="hidden print:block bg-white text-black font-sans p-4 max-w-[210mm] mx-auto text-sm leading-snug">

            {/* --- HEADER SECTION --- */}
            <div className="relative mb-2">
                {/* Contact Number */}
                <div className="text-right font-bold text-blue-900 text-sm mb-1">
                    Ph: +91-95009 79113
                </div>

                <div className="flex items-start gap-4 justify-between">
                    {/* Logo Area */}
                    <div className="w-24 h-24 flex items-center justify-center">
                        {/* Placeholder for the blue Winged Caduceus logo */}
                        <div className="relative w-20 h-20">
                            <img src={BillLogo} className="w-full h-full object-contain" alt="Hospital Logo" />
                        </div>
                    </div>

                    {/* Hospital Name Box */}
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
                    <div className="w-16"></div> {/* Spacer for balance */}
                </div>

                {/* Doctor Details */}
                <div className="text-center mt-2 text-blue-900">
                    <p className="font-bold text-sm">Dr. Mithren, M.B.B.S., M.S., FMAS, FIAGES, FALS.,</p>
                    <p className="font-semibold text-sm">Consultant General & Laparoscopic Surgeon</p>
                </div>
            </div>

            {/* Blue Divider Line */}
            <div className="w-full h-0.5 bg-blue-900 my-1"></div>

            {/* Pharmacy Title */}
            <h2 className="text-center font-bold text-blue-900 text-lg uppercase my-2">PHARMACY</h2>

            {/* --- PATIENT / BILL DETAILS --- */}
            <div className="flex justify-between items-end mb-4 px-2">
                <div className="flex-1 space-y-2">
                    <div className="font-bold text-sm">TO</div>
                    <div className="flex items-end gap-2">
                        <span className="font-bold w-8 text-right">M/s</span>
                        <div className="flex-1 border-b border-dotted border-slate-400 font-medium px-2">
                            {customerName}
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="font-bold w-12 ml-6 text-sm">Address</span>
                        <div className="flex-1 border-b border-dotted border-slate-400 font-medium px-2 text-xs">
                            {address}
                        </div>
                    </div>
                </div>

                <div className="w-1/3 pl-8 space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Bill No .</span>
                        <span className="font-bold">{billNo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Date .</span>
                        <span className="font-bold">{billDate}</span>
                    </div>
                </div>
            </div>

            {/* --- ITEMS TABLE --- */}
            <div className="border border-black mb-0">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-red-900 text-center font-bold">
                            <th className="border-r border-b border-black py-1 px-4 w-24">P Code</th>
                            <th className="border-r border-b border-black py-1 px-4 text-center">Particulars</th>
                            <th className="border-r border-b border-black py-1 px-1 w-16">Qty</th>
                            <th className="border-r border-b border-black py-1 px-2 w-20">Price</th>
                            <th className="border-b border-black py-1 px-2 w-24">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Minimum 10 rows to maintain height */}
                        {[...Array(Math.max(items.length, 10))].map((_, idx) => {
                            const item = items[idx];
                            return (
                                <tr key={idx} className="h-6">
                                    <td className="border-r border-black px-2 text-left align-middle">{item?.pCode || ''}</td>
                                    <td className="border-r border-black px-2 text-left align-middle">{item?.productName || ''}</td>
                                    <td className="border-r border-black px-2 text-center align-middle">{item?.qty || ''}</td>
                                    <td className="border-r border-black px-2 text-right align-middle">{item?.price?.toFixed(2) || ''}</td>
                                    <td className="px-2 text-right font-bold align-middle">{item?.amount?.toFixed(2) || ''}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- FOOTER / TOTALS --- */}
            <div className="border border-t-0 border-black flex">

                {/* Left Side: Amount in Words */}
                <div className="flex-1 p-2 border-r border-black flex flex-col justify-between">
                    <div className="mt-2">
                        <p className="text-xs font-bold mb-1">Amount Chargeable (in words)</p>
                        <p className="capitalize italic font-medium px-2">
                            {Math.round(netAmount) > 0 ? numberToWords(Math.round(netAmount)) : ''}
                        </p>
                    </div>
                </div>

                {/* Right Side: Totals Stack */}
                <div className="w-[35%] flex flex-col font-bold text-sm">
                    {/* Total Row */}
                    <div className="flex border-b border-black">
                        <div className="w-24 px-2 py-1 text-red-900">TOTAL</div>
                        <div className="flex-1 px-2 py-1 text-right">{totalAmount.toFixed(2)}</div>
                    </div>

                    {/* Discount */}
                    <div className="flex">
                        <div className="w-24 px-2 py-0.5 text-red-900 text-xs">DISCOUNT</div>
                        <div className="flex-1 px-2 py-0.5 text-right font-normal">{discount > 0 ? discount.toFixed(2) : ''}</div>
                    </div>

                    {/* Taxes */}
                    <div className="flex">
                        <div className="w-24 px-2 py-0.5 text-red-900 text-xs">SGST</div>
                        <div className="flex-1 px-2 py-0.5 text-right font-normal">{tax > 0 ? (tax / 2).toFixed(2) : ''}</div>
                    </div>
                    <div className="flex">
                        <div className="w-24 px-2 py-0.5 text-red-900 text-xs">CGST</div>
                        <div className="flex-1 px-2 py-0.5 text-right font-normal">{tax > 0 ? (tax / 2).toFixed(2) : ''}</div>
                    </div>
                    <div className="flex border-b border-black">
                        <div className="w-24 px-2 py-0.5 text-red-900 text-xs">IGST</div>
                        <div className="flex-1 px-2 py-0.5 text-right font-normal"></div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex items-center flex-1">
                        <div className="w-24 px-2 py-1 text-red-900 text-sm">GRAND TOTAL:</div>
                        <div className="flex-1 px-2 py-1 text-right text-base">{netAmount.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyBillPrint;
