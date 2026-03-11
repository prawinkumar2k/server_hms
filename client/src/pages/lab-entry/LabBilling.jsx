import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Save, X, Plus, Printer, Trash2, FileBarChart } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useToast } from '../../context/ToastContext';
import PatientSearch from '../../components/common/PatientSearch';

const LabBilling = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const [billDetails, setBillDetails] = useState({
        billNo: 'Auto',
        billDate: new Date().toISOString().split('T')[0],
        patientId: '',
        patientName: '',
        gstNo: '',
        items: []
    });

    // Auto-fill from TestEntry
    useEffect(() => {
        if (location.state) {
            const { patientId, patientName, tests } = location.state;
            setBillDetails(prev => ({
                ...prev,
                patientId: patientId || '',
                patientName: patientName || '',
                items: tests ? tests.map(t => ({
                    pcode: 'AUTO',
                    productName: t.name,
                    price: t.price || 0, // In real app, fetch price from master
                    amount: t.price || 0,
                    rno: 1
                })) : []
            }));
        }
    }, [location.state]);

    const [currentItem, setCurrentItem] = useState({
        pcode: '',
        productName: '',
        price: '',
        amount: ''
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await fetch('/api/lab/tests'); // Using same endpoint as entry
                if (res.ok) {
                    const data = await res.json();
                    // Map to billing format
                    const mapped = data.map(t => ({
                        code: t.testCode || 'T-AUTO',
                        name: `${t.testName} ${t.subTestName ? '- ' + t.subTestName : ''}`,
                        price: Number(t.price) || 0 // Assuming price exists in master
                    }));
                    setProducts(mapped);
                }
            } catch (e) { console.error(e); }
        };
        fetchTests();
    }, []);

    const handleProductSelect = (e) => {
        const product = products.find(p => p.name === e.target.value);
        if (product) {
            setCurrentItem({
                pcode: product.code,
                productName: product.name,
                price: product.price,
                amount: product.price
            });
        }
    };



    const addItem = () => {
        if (!currentItem.productName) return;
        setBillDetails(prev => ({
            ...prev,
            items: [...prev.items, { ...currentItem, rno: prev.items.length + 1 }]
        }));
        setCurrentItem({ pcode: '', productName: '', price: '', amount: '' });
    };

    const removeItem = (index) => {
        const newItems = billDetails.items.filter((_, i) => i !== index);
        setBillDetails(prev => ({ ...prev, items: newItems }));
    };

    const calculateTotal = () => {
        return billDetails.items.reduce((sum, item) => sum + Number(item.amount), 0);
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/lab/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...billDetails, totalAmount: calculateTotal() })
            });
            if (res.ok) {
                toast.success("Bill Saved & Printed");

                if (window.confirm("Bill Saved. Go to Test Reports?")) {
                    navigate('/lab-entry/report');
                } else {
                    setBillDetails({
                        billNo: 'Auto',
                        billDate: new Date().toISOString().split('T')[0],
                        patientId: '',
                        patientName: '',
                        gstNo: '',
                        items: []
                    });
                }
            } else {
                toast.error("Failed to save bill");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error saving bill");
        }
    }

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Billing</h1>
                        <p className="text-slate-500">Generate bills for lab tests and services.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                            <Plus className="h-4 w-4" /> New Bill
                        </Button>
                    </div>
                </div>

                <Card className="border-primary-100 shadow-md">
                    <CardContent className="p-6">
                        {/* Header Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Patient Search (ID/Name)</label>
                                <PatientSearch
                                    placeholder="Search Patient..."
                                    onSelect={(p) => {
                                        if (p) {
                                            setBillDetails(prev => ({
                                                ...prev,
                                                patientId: p.patientId,
                                                patientName: p.patientName
                                            }));
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Patient Name</label>
                                <input
                                    className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                    value={billDetails.patientName}
                                    onChange={(e) => setBillDetails({ ...billDetails, patientName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                <input
                                    type="date"
                                    className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                    value={billDetails.billDate}
                                    onChange={(e) => setBillDetails({ ...billDetails, billDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">GST No</label>
                                <input
                                    className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                    value={billDetails.gstNo}
                                    onChange={(e) => setBillDetails({ ...billDetails, gstNo: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Item Entry Line */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-500">Code</label>
                                <input className="w-full h-9 rounded text-sm border-slate-300"
                                    value={currentItem.pcode} readOnly placeholder="Code" />
                            </div>
                            <div className="md:col-span-4 space-y-1">
                                <label className="text-xs font-bold text-slate-500">Test / Product Name</label>
                                <select className="w-full h-9 rounded text-sm border-slate-300" onChange={handleProductSelect}>
                                    <option>Select Test...</option>
                                    {products.map((p, i) => <option key={i}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-500">Price</label>
                                <input className="w-full h-9 rounded text-sm border-slate-300"
                                    value={currentItem.price} readOnly />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-500">Amount</label>
                                <input className="w-full h-9 rounded text-sm border-slate-300"
                                    value={currentItem.amount} readOnly />
                            </div>
                            <div className="md:col-span-2">
                                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" onClick={addItem}>Add</Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="border rounded-lg overflow-hidden min-h-[200px]">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">RNo</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Code</th>
                                        <th className="px-4 py-3">Product Name</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {billDetails.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2">{idx + 1}</td>
                                            <td className="px-4 py-2">{billDetails.billDate}</td>
                                            <td className="px-4 py-2">{item.pcode}</td>
                                            <td className="px-4 py-2 font-medium">{item.productName}</td>
                                            <td className="px-4 py-2 text-right">{item.price}</td>
                                            <td className="px-4 py-2 text-right">{item.amount}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {billDetails.items.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-slate-400">No items added to bill.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Totals */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white shadow-md">
                                    <Save className="h-4 w-4 mr-2" /> Save / Print
                                </Button>
                                <Button variant="outline" className="text-slate-600">Close</Button>
                            </div>
                            <div className="bg-slate-900 text-white px-8 py-3 rounded-lg text-2xl font-bold shadow-lg">
                                Total: {calculateTotal()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    );
};

export default LabBilling;
