import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';

const CreateStockOrder = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefillPcode = searchParams.get('pcode');

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [items, setItems] = useState([]); // { pcode, productName, qty, price }

    // Item Input State
    const [currProduct, setCurrProduct] = useState('');
    const [currQty, setCurrQty] = useState(1);
    const [currPrice, setCurrPrice] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [supRes, prodRes] = await Promise.all([
                fetch('/api/pharmacy/suppliers', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/pharmacy/products', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (supRes.ok) setSuppliers(await supRes.json());
            if (prodRes.ok) {
                const prods = await prodRes.json();
                setProducts(prods);

                // Auto-add prefill
                if (prefillPcode) {
                    const p = prods.find(x => x.Pcode === prefillPcode);
                    if (p) {
                        setItems([{
                            pcode: p.Pcode,
                            productName: p.ProductName,
                            qty: parseInt(p.ReOrder) * 2 || 10, // heuristic
                            price: parseFloat(p.Amount) * 0.7 // Assuming purchase price is lower
                        }]);
                    }
                }
            }
        } catch (e) { console.error(e); }
    };

    const addItem = () => {
        if (!currProduct || currQty <= 0) return;
        const p = products.find(x => x.Pcode === currProduct);
        if (!p) return;

        setItems([...items, {
            pcode: p.Pcode,
            productName: p.ProductName,
            qty: parseFloat(currQty),
            price: parseFloat(currPrice)
        }]);

        setCurrProduct('');
        setCurrQty(1);
        setCurrPrice(0);
    };

    const removeItem = (idx) => {
        const newItems = [...items];
        newItems.splice(idx, 1);
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (!selectedSupplier || items.length === 0) return alert("Select supplier and add items.");

        try {
            const res = await fetch('/api/pharmacy/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ supplierId: selectedSupplier, items })
            });

            if (res.ok) {
                const data = await res.json();
                navigate(`/pharma-master/orders/${data.id}`);
            } else {
                alert("Failed to create order");
            }
        } catch (e) { console.error(e); }
    };

    const totalAmount = items.reduce((sum, i) => sum + (i.qty * i.price), 0);

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    <h1 className="text-2xl font-bold text-slate-800">Create Stock Order</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Supplier</label>
                                    <select
                                        className="w-full p-2 border rounded-lg bg-slate-50"
                                        value={selectedSupplier}
                                        onChange={e => setSelectedSupplier(e.target.value)}
                                    >
                                        <option value="">-- Choose Supplier --</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
                                    </select>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-sm text-slate-700 mb-3">Add Items</h3>
                                    <div className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-12 md:col-span-5">
                                            <label className="text-xs text-slate-500">Product</label>
                                            <select
                                                className="w-full p-2 border rounded text-sm"
                                                value={currProduct}
                                                onChange={e => {
                                                    setCurrProduct(e.target.value);
                                                    // Auto set price estimate
                                                    const p = products.find(x => x.Pcode === e.target.value);
                                                    if (p) setCurrPrice(parseFloat(p.Amount) * 0.7); // Estimated purchase price
                                                }}
                                            >
                                                <option value="">Select Product...</option>
                                                {products.map(p => <option key={p.Pcode} value={p.Pcode}>{p.ProductName}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="text-xs text-slate-500">Qty</label>
                                            <input type="number" min="1" className="w-full p-2 border rounded text-sm" value={currQty} onChange={e => setCurrQty(e.target.value)} />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <label className="text-xs text-slate-500">Unit Price Est. (₹)</label>
                                            <input type="number" min="0" className="w-full p-2 border rounded text-sm" value={currPrice} onChange={e => setCurrPrice(e.target.value)} />
                                        </div>
                                        <div className="col-span-12 md:col-span-2">
                                            <Button onClick={addItem} className="w-full bg-indigo-600 text-white"><Plus className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-2">Product</th>
                                                <th className="px-4 py-2">Qty</th>
                                                <th className="px-4 py-2">Price</th>
                                                <th className="px-4 py-2">Total</th>
                                                <th className="px-4 py-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 font-medium">{item.productName}</td>
                                                    <td className="px-4 py-2">{item.qty}</td>
                                                    <td className="px-4 py-2">₹{item.price}</td>
                                                    <td className="px-4 py-2">₹{item.qty * item.price}</td>
                                                    <td className="px-4 py-2 text-right">
                                                        <button onClick={() => removeItem(idx)} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {items.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-slate-400">No items added</td></tr>}
                                        </tbody>
                                        <tfoot className="bg-slate-50 font-bold">
                                            <tr>
                                                <td colSpan="3" className="px-4 py-2 text-right text-slate-600">Total Estimate:</td>
                                                <td className="px-4 py-2 text-indigo-700">₹{totalAmount.toFixed(2)}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardContent className="p-6 text-center space-y-4">
                                <h3 className="font-bold text-slate-700">Order Summary</h3>
                                <div className="text-3xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</div>
                                <p className="text-xs text-slate-500">{items.length} Items</p>
                                <hr className="border-slate-100" />
                                <Button
                                    onClick={handleSubmit}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                    disabled={!selectedSupplier || items.length === 0}
                                >
                                    <Save className="w-4 h-4 mr-2" /> Save Draft Order
                                </Button>
                                <p className="text-xs text-slate-400 mt-2">Order will be saved as DRAFT.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default CreateStockOrder;
