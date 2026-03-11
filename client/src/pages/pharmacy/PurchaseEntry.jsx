import React, { useState, useEffect } from 'react';
import { Plus, Save, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const PurchaseEntry = () => {
    const [purchases, setPurchases] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        purDate: new Date().toISOString().split('T')[0],
        vendor: '',
        productName: '',
        purRate: '',
        purQty: '',
        salesRate: ''
    });

    useEffect(() => {
        fetchPurchases();
        fetchVendors();
        fetchProducts();
    }, []);

    const fetchPurchases = async () => {
        try { const res = await fetch('/api/pharmacy/purchases'); setPurchases(await res.json()); } catch (e) { }
    };
    const fetchVendors = async () => {
        try { const res = await fetch('/api/pharmacy/vendors'); setVendors(await res.json()); } catch (e) { }
    };
    const fetchProducts = async () => {
        try { const res = await fetch('/api/pharmacy/products'); setProducts(await res.json()); } catch (e) { }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-fill Rates if Product matches
        if (name === 'productName') {
            const prod = products.find(p => p.ProductName === value);
            if (prod) {
                setFormData(prev => ({ ...prev, salesRate: prod.Amount, [name]: value }));
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.productName || !formData.vendor || !formData.purQty) return alert("Fill all fields");
        try {
            const res = await fetch('/api/pharmacy/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Purchase Recorded & Stock Updated");
                fetchPurchases();
                setFormData(prev => ({ ...prev, productName: '', purRate: '', purQty: '', salesRate: '' }));
            }
        } catch (e) { console.error(e); }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Entry</h1>
                    <p className="text-slate-500">Record new stock purchases from vendors.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="h-fit">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Plus className="w-5 h-5 text-green-500" /> New Purchase
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                    <input type="date" name="purDate" value={formData.purDate} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Vendor</label>
                                    <select name="vendor" value={formData.vendor} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm">
                                        <option value="">Select Vendor</option>
                                        {vendors.map(v => <option key={v.SNo} value={v.CompanyName}>{v.CompanyName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Product</label>
                                    <input list="prodList" name="productName" value={formData.productName} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="Search Product" />
                                    <datalist id="prodList">
                                        {products.map(p => <option key={p.Pcode} value={p.ProductName} />)}
                                    </datalist>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Purchase Rate</label>
                                        <input name="purRate" value={formData.purRate} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                                        <input name="purQty" value={formData.purQty} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Sales Rate</label>
                                    <input name="salesRate" value={formData.salesRate} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="0.00" />
                                </div>
                            </div>
                            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" onClick={handleSubmit}>
                                <Save className="w-4 h-4 mr-2" /> Save Purchase
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-0 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Product</th>
                                                <th className="px-6 py-4">Vendor</th>
                                                <th className="px-6 py-4 text-right">Qty</th>
                                                <th className="px-6 py-4 text-right">Pur. Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {purchases.map((p, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 text-slate-600">{p.PurDate && p.PurDate.split('T')[0]}</td>
                                                    <td className="px-6 py-4 font-medium text-slate-900">{p.ProductName}</td>
                                                    <td className="px-6 py-4 text-slate-600">{p.Vender}</td>
                                                    <td className="px-6 py-4 text-right">{p.PurQty}</td>
                                                    <td className="px-6 py-4 text-right">{p.PurRate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PurchaseEntry;
