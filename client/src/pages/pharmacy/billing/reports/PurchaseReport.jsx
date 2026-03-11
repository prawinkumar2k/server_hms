import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
    Printer, Calendar, Filter, FileText,
    ShoppingCart, Truck, Search
} from 'lucide-react';
import { Button } from '../../../../components/common/Button';

const PurchaseReport = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0].substring(0, 8) + '01'); // 1st of current month
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [vendorFilter, setVendorFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // For Printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Pharmacy_Purchase_Report_${toDate}`,
    });

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pharmacy/purchases');
            const data = await res.json();
            setPurchases(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/reports/generate?type=pharmacy-purchase`, {
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

    // Derived Logic
    const uniqueVendors = [...new Set(purchases.map(p => p.Vender).filter(Boolean))];

    const filteredPurchases = purchases.filter(p => {
        const pDate = p.PurDate ? p.PurDate.split('T')[0] : '';
        const inDateRange = (!fromDate || pDate >= fromDate) && (!toDate || pDate <= toDate);
        const matchesVendor = !vendorFilter || p.Vender === vendorFilter;
        const matchesSearch = !searchTerm ||
            (p.ProductName && p.ProductName.toLowerCase().includes(searchTerm.toLowerCase()));

        return inDateRange && matchesVendor && matchesSearch;
    });

    const totalSpend = filteredPurchases.reduce((acc, p) => acc + (parseFloat(p.PurRate || 0) * parseInt(p.PurQty || 0)), 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-IN');
    }

    const orgData = {
        name: "CITY HOSPITAL PHARMACY",
        address: "123, Health Avenue, Medical District, Mumbai - 400001",
        license: "DL-2024-MH-987654"
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Purchase Report</h1>
                        <p className="text-xs text-slate-500">Inward supply and vendor history</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    {/* Date Range */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                        <span className="text-xs text-slate-400 font-bold uppercase">From</span>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none w-28"
                        />
                        <span className="text-slate-300">|</span>
                        <span className="text-xs text-slate-400 font-bold uppercase">To</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none w-28"
                        />
                    </div>

                    {/* Vendor Filter */}
                    <div className="relative">
                        <Truck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={vendorFilter}
                            onChange={(e) => setVendorFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[150px]"
                        >
                            <option value="">All Vendors</option>
                            {uniqueVendors.map((v, i) => (
                                <option key={i} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative flex-grow xl:flex-grow-0">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Product Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button onClick={handlePrint} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 gap-2 ml-auto">
                        <Printer className="w-4 h-4" /> Quick Print
                    </Button>
                    <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <FileText className="w-4 h-4" /> Official PDF
                    </Button>
                </div>
            </div>

            {/* Printable Content */}
            <div className="printable-content bg-white shadow-lg rounded-none mx-auto w-full print:shadow-none min-h-[800px]" ref={componentRef}>
                <div className="p-10 space-y-6 print:p-0">

                    {/* Report Header */}
                    <div className="border-b-2 border-slate-800 pb-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="text-left">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide mb-1">{orgData.name}</h2>
                                <p className="text-slate-600 font-medium text-sm">{orgData.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Period</p>
                                <p className="text-sm font-bold text-blue-600">
                                    {formatDate(fromDate)} - {formatDate(toDate)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 p-4 mb-6">
                        <div className="text-center border-r border-slate-200">
                            <p className="text-xs text-slate-500 font-bold uppercase">Total Transactions</p>
                            <p className="text-xl font-black text-slate-900">{filteredPurchases.length}</p>
                        </div>
                        <div className="text-center border-r border-slate-200">
                            <p className="text-xs text-slate-500 font-bold uppercase">Total Vendor Spend</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrency(totalSpend)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase">Unique Products</p>
                            <p className="text-xl font-bold text-slate-700">{[...new Set(filteredPurchases.map(p => p.ProductName))].length}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left border border-slate-200">
                            <thead className="text-xs text-white uppercase bg-slate-800 print:bg-slate-800 print:text-white">
                                <tr>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24">Date</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600">Product Name</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600">Vendor</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24 text-center">Qty</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-28 text-right">Buy Rate</th>
                                    <th className="px-4 py-3 font-bold text-right w-32">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredPurchases.map((p, idx) => {
                                    const total = (parseFloat(p.PurRate || 0) * parseInt(p.PurQty || 0));
                                    return (
                                        <tr key={idx} className="bg-white border-b border-slate-200 print:break-inside-avoid">
                                            <td className="px-4 py-2 text-slate-500 border-r border-slate-100 text-xs text-center">{formatDate(p.PurDate)}</td>
                                            <td className="px-4 py-2 font-medium text-slate-800 border-r border-slate-100">{p.ProductName}</td>
                                            <td className="px-4 py-2 text-slate-600 border-r border-slate-100 text-xs">
                                                <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-slate-400" /> {p.Vender || 'N/A'}</span>
                                            </td>
                                            <td className="px-4 py-2 text-center font-bold border-r border-slate-100">{p.PurQty}</td>
                                            <td className="px-4 py-2 text-right border-r border-slate-100 text-xs">{formatCurrency(p.PurRate)}</td>
                                            <td className="px-4 py-2 text-right font-bold text-slate-900">{formatCurrency(total)}</td>
                                        </tr>
                                    );
                                })}
                                {filteredPurchases.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                                            No purchase records found for selected criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseReport;
