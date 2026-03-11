import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, Save, User, FileText, Search, CreditCard, X, Pill } from 'lucide-react';
import { Card, CardContent } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import PageTransition from '../../../components/layout/PageTransition';
import { useToast } from '../../../context/ToastContext';
import PatientSearch from '../../../components/common/PatientSearch';
import PharmacyBillPrint from '../../../components/print/PharmacyBillPrint';

const PharmacyBilling = () => {
    // --- State ---
    const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
    const [productSearchResults, setProductSearchResults] = useState([]);
    // const [showPatientSearch, setShowPatientSearch] = useState(false); // Removed
    const toast = useToast();

    // Bill Header
    const [customer, setCustomer] = useState({
        id: '', name: '', mobile: '', address: '', gstNo: '', doctor: ''
    });
    const [paymentMode, setPaymentMode] = useState('Cash'); // Cash or Credit

    // Line Items
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        pCode: '', productName: '', description: '', qty: 1, price: 0, stock: 0
    });

    // Totals
    const [discount, setDiscount] = useState(0);
    const [taxPercent, setTaxPercent] = useState(0); // For simple calculation display only
    const [printBill, setPrintBill] = useState(null);

    // Pending Prescriptions
    const [showPending, setShowPending] = useState(false);
    const [pendingList, setPendingList] = useState([]);

    // --- Effects ---
    useEffect(() => {
        // Close search dropdowns on click outside (simplified)
        const closeSearch = () => { setProductSearchResults([]); };
        document.addEventListener('click', closeSearch);
        return () => document.removeEventListener('click', closeSearch);
    }, []);

    // --- Search Handlers ---
    const searchProducts = async (query) => {
        if (!query) { setProductSearchResults([]); return; }
        try {
            // Assuming we have a product list endpoint that can filter or we just fetch all and filter client side for now (optimization later)
            const res = await fetch('/api/pharmacy/products');
            const data = await res.json();
            const filtered = data.filter(p => p.ProductName.toLowerCase().includes(query.toLowerCase()));
            setProductSearchResults(filtered.slice(0, 10));
        } catch (e) { console.error(e); }
    };


    const selectProduct = (p) => {
        setCurrentItem({
            pCode: p.Pcode,
            productName: p.ProductName,
            description: p.Description,
            qty: 1,
            price: Number(p.Amount),
            stock: Number(p.Stock)
        });
        setProductSearchResults([]);
    };

    // --- Item Management ---
    const addItem = (e) => {
        e.preventDefault(); // Prevent form submit if inside form
        e.stopPropagation(); // Stop bubbling

        if (!currentItem.pCode) return toast.warning("Select a product first");
        if (currentItem.qty > currentItem.stock) return toast.warning(`Low Stock! Available: ${currentItem.stock}`);

        setItems([...items, { ...currentItem, amount: currentItem.qty * currentItem.price }]);
        setCurrentItem({ pCode: '', productName: '', description: '', qty: 1, price: 0, stock: 0 }); // Reset
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // --- Calculations ---
    const subTotal = items.reduce((acc, item) => acc + item.amount, 0);
    // Simple Tax logic as per image (SGST+CGST etc. usually calculated on Taxable Value)
    // Here we will just apply a flat tax % if needed or just sum up totals
    const taxAmount = (subTotal * (taxPercent / 100));
    const netTotal = subTotal - discount + taxAmount;

    // --- Submit ---
    const [activePrescriptionId, setActivePrescriptionId] = useState(null);

    const handleSave = async () => {
        if (items.length === 0) return toast.warning("No items in bill");
        if (!customer.name) return toast.warning("Select Customer");

        const payload = {
            billDate,
            patientId: customer.id,
            customerName: customer.name,
            mobile: customer.mobile,
            address: customer.address,
            gstNo: customer.gstNo,
            doctorName: customer.doctor,
            paymentMode,
            items,
            totalAmount: subTotal,
            discount,
            tax: taxAmount,
            netAmount: netTotal
        };

        try {
            const res = await fetch('/api/pharmacy-billing/bill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Bill Saved! Bill No: ${data.billNo}`);

                // If this bill came from a prescription, mark it as Billed/Completed
                if (activePrescriptionId) {
                    await fetch(`/api/prescriptions/${activePrescriptionId}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'BILLED' })
                    });
                    setActivePrescriptionId(null);
                }

                // Trigger Print
                setPrintBill({ ...payload, billNo: data.billNo });
                window.setTimeout(() => window.print(), 100);
                // Reset
                setItems([]);
                setCustomer({ id: '', name: '', mobile: '', address: '', gstNo: '', doctor: '' });
                setDiscount(0);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to save bill");
        }
    };

    // --- Prescription Management ---
    const fetchPendingPrescriptions = async () => {
        setShowPending(true);
        try {
            const res = await fetch('/api/prescriptions?status=PENDING_PHARMACY');
            if (res.ok) {
                const data = await res.json();
                setPendingList(data);
            } else {
                toast.error("Failed to load pending prescriptions");
            }
        } catch (e) {
            console.error("Failed to fetch pending prescriptions:", e);
            toast.error("Failed to fetch pending prescriptions");
            setPendingList([]);
        }
    };

    const loadPrescription = async (rx) => {
        setActivePrescriptionId(rx.id); // Track ID for status update
        // Fetch products to map prices and codes
        let productMap = {};
        try {
            const res = await fetch('/api/pharmacy/products');
            if (res.ok) {
                const products = await res.json();
                // Create a map for case-insensitive name lookup
                products.forEach(p => {
                    productMap[p.ProductName.toLowerCase()] = p;
                });
            }
        } catch (e) {
            console.error("Failed to fetch products for mapping", e);
            toast.warning("Could not fetch latest prices. Items added with zero price.");
        }

        // Set customer details from prescription
        setCustomer({
            id: rx.patientId,
            name: rx.patientName,
            mobile: rx.phone || '', // Check if phone is in rx, otherwise might be missing
            address: rx.address || '',
            gstNo: '',
            doctor: rx.doctorName || 'Unknown' // Some backends might not return doctorName if not in schema properly
        });

        // Add medicines from prescription to items
        const newItems = rx.medicines.map(med => {
            // med.tablet comes from the backend service model
            const medName = med.tablet || med.name;
            const product = productMap[medName.toLowerCase()];

            if (product) {
                return {
                    pCode: product.Pcode,
                    productName: product.ProductName,
                    description: product.Description || med.description || 'Rx Item',
                    qty: Number(med.qty) || 1,
                    price: Number(product.Amount),
                    stock: Number(product.Stock),
                    amount: (Number(med.qty) || 1) * Number(product.Amount)
                };
            } else {
                // Fallback if product not found in master
                return {
                    pCode: 'MISC',
                    productName: medName,
                    description: 'Prescription Item (Not Linked)',
                    qty: Number(med.qty) || 1,
                    price: 0,
                    stock: 0,
                    amount: 0
                };
            }
        });

        setItems(newItems);
        setShowPending(false); // Close modal after loading

        if (newItems.some(i => i.price === 0)) {
            toast.warning("Some items were not found in the product master and have 0 price.");
        } else {
            toast.success("Prescription loaded successfully!");
        }
    };

    return (
        <PageTransition>
            <div className="flex flex-col h-[calc(100vh-80px)] space-y-4">
                {/* Header / Customer Info */}
                <Card className="flex-none">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" /> Pharmacy Billing
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    Date:
                                    <input type="date" value={billDate} onChange={e => setBillDate(e.target.value)} className="border rounded p-1 text-sm" />
                                </label>
                                <Button variant="outline" size="sm" onClick={fetchPendingPrescriptions} className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100">
                                    <Pill className="h-4 w-4 mr-2" /> Pending Rx
                                </Button>
                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                                    <button
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${paymentMode === 'Cash' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}
                                        onClick={() => setPaymentMode('Cash')}
                                    >Cash</button>
                                    <button
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${paymentMode === 'Credit' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}
                                        onClick={() => setPaymentMode('Credit')}
                                    >Credit</button>
                                </div>
                            </div>
                        </div>

                        {/* Customer Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            {/* Patient Search */}
                            <div className="md:col-span-1 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">Patient Name / Search</label>
                                <PatientSearch
                                    placeholder="Search or Enter Name..."
                                    value={customer.name}
                                    onChange={(val) => setCustomer(p => ({ ...p, name: val }))}
                                    onSelect={(p) => {
                                        if (p) {
                                            setCustomer({
                                                id: p.patientId,
                                                name: p.patientName,
                                                mobile: p.mobile,
                                                address: p.address || '',
                                                gstNo: '',
                                                doctor: p.refDoctor || ''
                                            });
                                        }
                                    }}
                                />
                            </div>

                            <div className="relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">Mobile No</label>
                                <input className="w-full h-9 text-sm border rounded shadow-sm px-2" value={customer.mobile} onChange={e => setCustomer({ ...customer, mobile: e.target.value })} placeholder="Phone" />
                            </div>

                            <div className="relative md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                                <input className="w-full h-9 text-sm border rounded shadow-sm px-2" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} placeholder="Full Address" />
                            </div>

                            <div className="relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">GST No</label>
                                <input className="w-full h-9 text-sm border rounded shadow-sm px-2" value={customer.gstNo} onChange={e => setCustomer({ ...customer, gstNo: e.target.value })} placeholder="Optional" />
                            </div>

                            <div className="relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">Patient ID</label>
                                <input className="w-full h-9 text-sm border rounded shadow-sm px-2 bg-slate-100" value={customer.id} readOnly placeholder="Auto-Fill" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Item Entry & Table */}
                <Card className="flex-1 flex flex-col min-h-0">
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Item Entry Bar */}
                        <div className="p-4 bg-indigo-50 border-b border-indigo-100 grid grid-cols-12 gap-3 items-end">
                            <div className="col-span-4 relative">
                                <label className="text-xs font-bold text-indigo-800 uppercase">Product Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        className="w-full pl-8 h-9 text-sm border border-indigo-200 rounded shadow-sm focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Scan Barcode or Search..."
                                        value={currentItem.productName}
                                        onChange={(e) => {
                                            setCurrentItem(prev => ({ ...prev, productName: e.target.value }));
                                            searchProducts(e.target.value);
                                        }}
                                        autoFocus
                                    />
                                    {productSearchResults.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border shadow-lg rounded-md mt-1 z-50 max-h-60 overflow-y-auto">
                                            {productSearchResults.map(p => (
                                                <div key={p.Pcode} className="p-2 hover:bg-indigo-50 cursor-pointer text-sm flex justify-between" onClick={() => selectProduct(p)}>
                                                    <span>{p.ProductName}</span>
                                                    <span className="text-xs font-mono bg-slate-100 px-1 rounded">Stock: {p.Stock}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-indigo-800 uppercase">Price</label>
                                <input className="w-full h-9 text-sm border border-indigo-200 rounded px-2" type="number" value={currentItem.price} onChange={e => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-indigo-800 uppercase">Avail. Stock</label>
                                <input className="w-full h-9 text-sm border border-indigo-200 bg-white rounded px-2 text-slate-500" disabled value={currentItem.stock} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-indigo-800 uppercase">Qty</label>
                                <div className="flex items-center">
                                    <button className="h-9 w-8 bg-white border border-r-0 border-indigo-200 rounded-l hover:bg-slate-50" onClick={() => setCurrentItem(p => ({ ...p, qty: Math.max(1, p.qty - 1) }))}>-</button>
                                    <input className="w-full h-9 text-sm border border-indigo-200 text-center" type="number" value={currentItem.qty} onChange={e => setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) || 1 })} />
                                    <button className="h-9 w-8 bg-white border border-l-0 border-indigo-200 rounded-r hover:bg-slate-50" onClick={() => setCurrentItem(p => ({ ...p, qty: p.qty + 1 }))}>+</button>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <Button className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={addItem}>Add Line</Button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-auto bg-slate-50/50">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-slate-500 font-medium border-b sticky top-0 shadow-sm z-10">
                                    <tr>
                                        <th className="px-4 py-3 w-12">#</th>
                                        <th className="px-4 py-3">Product Name</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Qty</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                            <td className="px-4 py-2 font-medium text-slate-900">{item.productName}</td>
                                            <td className="px-4 py-2 text-slate-500 text-xs">{item.description}</td>
                                            <td className="px-4 py-2 text-right">{item.price.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right">{item.qty}</td>
                                            <td className="px-4 py-2 text-right font-bold text-slate-700">{item.amount.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr><td colSpan="7" className="p-10 text-center text-slate-400 italic">No items added to bill yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Totals */}
                        <div className="border-t border-slate-200 bg-white p-4">
                            <div className="flex flex-col md:flex-row gap-6 justify-end items-end">
                                <div className="space-y-4 w-full md:w-auto min-w-[300px]">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Sub Total</span>
                                        <span className="font-medium">{subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Discount (₹)</span>
                                        <input className="w-24 text-right border rounded px-1 py-0.5 text-sm" type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Tax (%) (GST)</span>
                                        <input className="w-24 text-right border rounded px-1 py-0.5 text-sm" type="number" value={taxPercent} onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)} />
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-800">Net Total</span>
                                        <span className="text-2xl font-bold text-indigo-600">{netTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <Button variant="outline" className="flex-1 md:flex-none">Cancel</Button>
                                    <Button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 min-w-[140px]" onClick={handleSave}>
                                        <Printer className="w-4 h-4 mr-2" />
                                        Save & Print
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Prescriptions Modal */}
            {showPending && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Pill className="h-5 w-5 text-indigo-600" /> Pending Prescriptions
                            </h3>
                            <button onClick={() => setShowPending(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-3">
                            {pendingList.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No pending prescriptions found.</p>
                            ) : (
                                pendingList.map((rx, idx) => (
                                    <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:bg-indigo-50/50 transition-colors cursor-pointer group" onClick={() => loadPrescription(rx)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-slate-900">{rx.patientName}</div>
                                                <div className="text-xs text-slate-500">ID: {rx.patientId} • {rx.age}/{rx.gender}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{rx.date}</div>
                                                <div className="text-xs text-slate-500 mt-1">Dr. {rx.doctorName}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-600 border-t border-slate-100 pt-2 mt-2">
                                            <p className="font-medium text-xs text-slate-400 uppercase mb-1">Medicines:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {rx.medicines.map((m, i) => (
                                                    <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-700 shadow-sm">
                                                        {m.name} <span className="text-slate-400">({m.qty})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-3 hidden group-hover:block">
                                            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Load into Bill</Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Print Template */}
            <PharmacyBillPrint data={printBill} />
        </PageTransition>
    );
};

export default PharmacyBilling;
