import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, DollarSign, FileText, CheckCircle, AlertCircle, Printer, Trash2, Loader2, Calendar, X, Filter } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import InvoicePrint from '../../components/print/InvoicePrint';
import MedicineSearch from '../../components/common/MedicineSearch';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const Billing = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activePreset, setActivePreset] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [modalOpen, setModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedInv, setSelectedInv] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    // Print State
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const triggerPrint = useReactToPrint({
        contentRef: printRef,
        onAfterPrint: () => setIsPrinting(false)
    });

    const handlePrint = async (id) => {
        setIsPrinting(true);
        try {
            const res = await fetch(`/api/billing/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPrintData(data);
                // Allow state to update before printing
                setTimeout(() => {
                    triggerPrint();
                }, 100);
            }
        } catch (error) {
            console.error("Print failed", error);
            setIsPrinting(false);
        }
    };

    // Invoice Form State
    const [formData, setFormData] = useState({
        patient_name: '',
        category: 'General',
        due_date: new Date().toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0 }]
    });

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/billing');
            const data = await res.json();
            setInvoices(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/inventory/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchProducts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchInvoices();
                setFormData({ patient_name: '', category: 'General', due_date: new Date().toISOString().split('T')[0], items: [{ description: '', quantity: 1, unit_price: 0 }] });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/billing/${selectedInv.id}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(paymentAmount) })
            });
            if (res.ok) {
                setPaymentModalOpen(false);
                fetchInvoices();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (id) => {
        setInvoiceToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await fetch(`/api/billing/${invoiceToDelete}`, { method: 'DELETE' });
            setDeleteModalOpen(false);
            fetchInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }] });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleProductSelect = (index, product) => {
        if (!product) return;
        const newItems = [...formData.items];
        newItems[index].description = product.ProductName;
        newItems[index].unit_price = parseFloat(product.Amount || 0);
        setFormData({ ...formData, items: newItems });
    };

    const openPaymentModal = (inv) => {
        setSelectedInv(inv);
        setPaymentAmount('');
        setPaymentModalOpen(true);
    };

    // Quick date preset helpers
    const applyPreset = (preset) => {
        const today = new Date();
        let start = '';
        let end = today.toISOString().split('T')[0];

        if (preset === activePreset) {
            setFromDate('');
            setToDate('');
            setActivePreset('');
            return;
        }

        switch (preset) {
            case 'today':
                start = end;
                break;
            case 'week': {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                start = weekStart.toISOString().split('T')[0];
                break;
            }
            case 'month': {
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                start = monthStart.toISOString().split('T')[0];
                break;
            }
            default:
                break;
        }

        setFromDate(start);
        setToDate(end);
        setActivePreset(preset);
    };

    const clearFilters = () => {
        setFromDate('');
        setToDate('');
        setSearchTerm('');
        setActivePreset('');
    };

    const hasActiveFilters = fromDate || toDate || searchTerm;

    // Filtered + sorted invoices
    const filteredInvoices = useMemo(() => {
        let result = invoices.filter(inv => {
            const matchesSearch =
                !searchTerm ||
                inv.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.id?.toString().includes(searchTerm) ||
                inv.total_amount?.toString().includes(searchTerm) ||
                inv.category?.toLowerCase().includes(searchTerm.toLowerCase());

            const invDate = new Date(inv.invoice_date || inv.created_at);
            invDate.setHours(0, 0, 0, 0);

            let matchesDate = true;
            if (fromDate) {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && invDate >= from;
            }
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && invDate <= to;
            }

            return matchesSearch && matchesDate;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.invoice_date || a.created_at);
            const dateB = new Date(b.invoice_date || b.created_at);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [invoices, searchTerm, fromDate, toDate, sortOrder]);

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Billing & Payments</h1>
                        <p className="text-slate-500">Manage invoices and track payments.</p>
                    </div>
                    {user?.role !== 'Admin' && (
                        <Button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <Plus className="h-4 w-4 mr-2" /> New Invoice
                        </Button>
                    )}
                </div>

                {/* Invoices List */}
                <Card>
                    {/* Filter Header */}
                    <div className="border-b border-slate-100 p-4">
                        <div className="flex flex-col gap-4">
                            {/* Row 1: Search + Quick Presets */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by patient, ID, amount..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Quick:</span>
                                    {[
                                        { key: 'today', label: 'Today' },
                                        { key: 'week', label: 'This Week' },
                                        { key: 'month', label: 'This Month' },
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => applyPreset(key)}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${activePreset === key
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Row 2: Date Range Pickers + Sort + Clear */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-500 font-medium">Date Range:</span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => {
                                                setFromDate(e.target.value);
                                                setActivePreset('');
                                            }}
                                            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                    </div>

                                    <span className="text-slate-400 text-sm">to</span>

                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => {
                                                setToDate(e.target.value);
                                                setActivePreset('');
                                            }}
                                            min={fromDate}
                                            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                        className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center gap-1"
                                        title={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
                                    >
                                        {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
                                    </button>

                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-3 py-2 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-1"
                                        >
                                            <X className="h-3 w-3" />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Active filter summary */}
                            {hasActiveFilters && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/50 rounded-lg px-3 py-2 border border-blue-100">
                                    <Filter className="h-3 w-3 text-blue-500" />
                                    <span>
                                        Showing <strong className="text-slate-700">{filteredInvoices.length}</strong> of{' '}
                                        <strong className="text-slate-700">{invoices.length}</strong> records
                                        {fromDate && <span> from <strong className="text-slate-700">{new Date(fromDate).toLocaleDateString()}</strong></span>}
                                        {toDate && <span> to <strong className="text-slate-700">{new Date(toDate).toLocaleDateString()}</strong></span>}
                                        {searchTerm && <span> matching "<strong className="text-slate-700">{searchTerm}</strong>"</span>}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th
                                        className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors select-none"
                                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                    >
                                        Date {sortOrder === 'desc' ? '↓' : '↑'}
                                    </th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Paid</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="8" className="text-center py-8">Loading...</td></tr>
                                ) : filteredInvoices.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-8 text-slate-500">No records found for the selected filters.</td></tr>
                                ) : (
                                    filteredInvoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-500">#{inv.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{inv.patient_name}</td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(inv.invoice_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-slate-500">{inv.category}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">₹{inv.total_amount}</td>
                                            <td className="px-6 py-4 text-slate-500">₹{inv.paid_amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                                    inv.status === 'Partial' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                {inv.status !== 'Paid' && (
                                                    <Button size="sm" variant="outline" onClick={() => openPaymentModal(inv)} className="text-blue-600 hover:bg-blue-50">
                                                        <DollarSign className="h-4 w-4 mr-1" /> Pay
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" onClick={() => handlePrint(inv.id)} className="text-slate-400 hover:text-slate-600">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(inv.id)} className="text-slate-400 hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Create Invoice Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">Create New Invoice</h3>
                                <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>X</Button>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Patient Name</label>
                                        <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                                            value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Category</label>
                                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option>General</option>
                                            <option>OPD</option>
                                            <option>IPD</option>
                                            <option>Pharmacy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Due Date</label>
                                        <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                                            value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-sm">Items</h4>
                                        <Button type="button" size="sm" variant="outline" onClick={addItem}>+ Add Item</Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 items-start">
                                                <div className="flex-1">
                                                    <MedicineSearch
                                                        value={item.description}
                                                        onChange={(val) => updateItem(idx, 'description', val)}
                                                        onSelect={(prod) => handleProductSelect(idx, prod)}
                                                        products={products}
                                                        placeholder="Description / Product"
                                                        className="w-full"
                                                    />
                                                </div>
                                                <input type="number" placeholder="Qty" className="w-16 border border-slate-200 rounded px-2 py-2 text-sm"
                                                    value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))} required min="1" />
                                                <input type="number" placeholder="Price" className="w-24 border border-slate-200 rounded px-2 py-2 text-sm"
                                                    value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))} required min="0" />
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)} className="text-red-500 mt-1"><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-right font-bold text-lg">
                                        Total: ₹{formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">Generate Invoice</Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Payment Modal */}
                {paymentModalOpen && selectedInv && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">Record Payment</h3>
                                <Button variant="ghost" size="sm" onClick={() => setPaymentModalOpen(false)}>X</Button>
                            </div>
                            <form onSubmit={handlePayment} className="p-6 space-y-4">
                                <div className="p-3 bg-slate-50 rounded-lg text-sm space-y-1">
                                    <div className="flex justify-between"><span>Total:</span> <span className="font-bold">₹{selectedInv.total_amount}</span></div>
                                    <div className="flex justify-between"><span>Paid:</span> <span>₹{selectedInv.paid_amount}</span></div>
                                    <div className="flex justify-between text-red-600"><span>Due:</span> <span className="font-bold">₹{(selectedInv.total_amount - selectedInv.paid_amount).toFixed(2)}</span></div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Payment Amount (₹)</label>
                                    <input type="number" required autoFocus className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} max={selectedInv.total_amount - selectedInv.paid_amount} min="0.01" step="0.01" />
                                </div>
                                <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Confirm Payment</Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && invoiceToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-6 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Delete Invoice?</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Are you sure you want to delete invoice #{invoiceToDelete}? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                                    <Button className="flex-1 bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200" onClick={confirmDelete}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Hidden Print Component */}
                <div style={{ display: 'none' }}>
                    <InvoicePrint ref={printRef} data={printData} />
                </div>
            </div>
        </PageTransition>
    );
};

export default Billing;
