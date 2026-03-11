import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
    Printer, Package, FileText,
    AlertTriangle, CheckCircle2, Search, Filter
} from 'lucide-react';
import { Button } from '../../../../components/common/Button';

const StockReport = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Low Stock, outOfStock
    const [searchTerm, setSearchTerm] = useState('');

    // For Printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Pharmacy_Stock_Report_${new Date().toISOString().split('T')[0]}`,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pharmacy/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const stock = parseInt(p.Stock || 0);
        const reOrder = parseInt(p.ReOrder || 0);

        const matchesSearch = p.ProductName.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'Low Stock') return stock <= reOrder && stock > 0;
        if (filter === 'Out of Stock') return stock === 0;
        return true;
    });

    // Summary Calculations
    const totalItems = products.length;
    const totalValue = products.reduce((acc, p) => acc + (parseInt(p.Stock || 0) * parseFloat(p.Amount || 0)), 0);
    const lowStockCount = products.filter(p => parseInt(p.Stock) <= parseInt(p.ReOrder)).length;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const orgData = {
        name: "CITY HOSPITAL PHARMACY",
        address: "123, Health Avenue, Medical District, Mumbai - 400001",
        license: "DL-2024-MH-987654"
    };

    const handleDownloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/reports/generate?type=pharmacy-stock`, {
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

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Stock Report</h1>
                        <p className="text-xs text-slate-500">Current inventory status & valuation</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="All">All Items</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>

                    <Button onClick={handlePrint} variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 gap-2">
                        <Printer className="w-4 h-4" /> Quick Print
                    </Button>
                    <Button onClick={handleDownloadPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <FileText className="w-4 h-4" /> Official PDF
                    </Button>
                </div>
            </div>

            {/* Printable Content */}
            <div className="printable-content bg-white shadow-lg rounded-none mx-auto w-full print:shadow-none min-h-[800px]" ref={componentRef}>
                <div className="p-10 space-y-6 print:p-0">

                    {/* Header */}
                    <div className="border-b-2 border-slate-800 pb-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="text-left">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide mb-1">{orgData.name}</h2>
                                <p className="text-slate-600 font-medium text-sm">{orgData.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                                <p className="text-lg font-bold text-emerald-600">{new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Row */}
                    <div className="flex gap-4 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 p-4">
                        <div
                            className="flex-1 text-center border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors p-2 -ml-2 rounded-l-lg"
                            onClick={() => setFilter('All')}
                        >
                            <p className="text-xs text-slate-500 font-bold uppercase">Total Items</p>
                            <p className="text-xl font-black text-slate-900">{totalItems}</p>
                        </div>
                        <div className="flex-1 text-center border-r border-slate-200">
                            <p className="text-xs text-slate-500 font-bold uppercase">Total Valuation</p>
                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalValue)}</p>
                        </div>
                        <div
                            className="flex-1 text-center cursor-pointer hover:bg-rose-50 transition-colors rounded-r-lg p-2 -mr-2"
                            onClick={() => setFilter('Low Stock')}
                        >
                            <p className="text-xs text-slate-500 font-bold uppercase">Low Stock Alerts</p>
                            <p className="text-xl font-bold text-rose-600">{lowStockCount}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left border border-slate-200">
                            <thead className="text-xs text-white uppercase bg-slate-800 print:bg-slate-800 print:text-white">
                                <tr>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-16 text-center">P-Code</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600">Product Name</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-32">Description</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24 text-right">Price</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24 text-center">Re-Order</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-600 w-24 text-center">Stock</th>
                                    <th className="px-4 py-3 font-bold text-center w-24">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredProducts.map((p, idx) => {
                                    const stock = parseInt(p.Stock || 0);
                                    const reOrder = parseInt(p.ReOrder || 0);
                                    let statusColor = "bg-emerald-100 text-emerald-700";
                                    let statusText = "Good";

                                    if (stock === 0) {
                                        statusColor = "bg-slate-100 text-slate-600";
                                        statusText = "Empty";
                                    } else if (stock <= reOrder) {
                                        statusColor = "bg-rose-100 text-rose-700";
                                        statusText = "Low";
                                    }

                                    return (
                                        <tr key={idx} className="bg-white border-b border-slate-200 print:break-inside-avoid">
                                            <td className="px-4 py-2 font-mono text-xs text-center text-slate-500 border-r border-slate-100">{p.Pcode}</td>
                                            <td className="px-4 py-2 font-medium text-slate-800 border-r border-slate-100">{p.ProductName}</td>
                                            <td className="px-4 py-2 text-xs text-slate-500 border-r border-slate-100 truncate max-w-[150px]">{p.Description}</td>
                                            <td className="px-4 py-2 text-right border-r border-slate-100">{formatCurrency(p.Amount)}</td>
                                            <td className="px-4 py-2 text-center text-slate-500 border-r border-slate-100">{p.ReOrder}</td>
                                            <td className="px-4 py-2 text-center font-bold border-r border-slate-100">{p.Stock}</td>
                                            <td className="px-4 py-2 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${statusColor} border border-transparent print:border-slate-300`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockReport;
