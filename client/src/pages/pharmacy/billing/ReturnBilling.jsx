import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, Search, X } from 'lucide-react';
import { Card, CardContent } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import PageTransition from '../../../components/layout/PageTransition';

const ReturnBilling = () => {
    const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
    const [billNo, setBillNo] = useState('');

    // Line Items
    const [items, setItems] = useState([]);
    // State for searching product to return (manual entry for now as per image or scanning)
    const [currentItem, setCurrentItem] = useState({
        pCode: '', productName: '', returnQty: 1, price: 0, discount: 0
    });
    const [productSearchResults, setProductSearchResults] = useState([]);


    const searchProducts = async (query) => {
        if (!query) { setProductSearchResults([]); return; }
        try {
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
            returnQty: 1,
            price: Number(p.Amount),
            discount: 0
        });
        setProductSearchResults([]);
    };

    const addItem = () => {
        if (!currentItem.pCode) return alert("Select Product");
        const returnAmount = (currentItem.qty || currentItem.returnQty) * currentItem.price; // Simple logic
        // Refund logic: (Price * Qty) - Discount?
        const totalRefund = (currentItem.returnQty * currentItem.price) - currentItem.discount;

        setItems([...items, { ...currentItem, returnAmount, totalRefund }]);
        setCurrentItem({ pCode: '', productName: '', returnQty: 1, price: 0, discount: 0 });
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!billNo) return alert("Enter Original Bill No");
        if (items.length === 0) return alert("No items to return");

        try {
            const res = await fetch('/api/pharmacy-billing/return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    returnDate,
                    billNo,
                    items
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Return Saved! Return No: ${data.returnNo}`);
                setItems([]);
                setBillNo('');
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save return");
        }
    };

    return (
        <PageTransition>
            <div className="flex flex-col h-[calc(100vh-80px)] space-y-4">
                <Card className="flex-none">
                    <CardContent className="p-4">
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <RefreshCw className="w-5 h-5 text-orange-600" /> Return Billing
                        </h1>
                        <div className="flex gap-4 items-end">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Return Date</label>
                                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full h-9 border rounded px-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Original Bill No</label>
                                <input className="w-full h-9 border rounded px-2 text-sm" value={billNo} onChange={e => setBillNo(e.target.value)} placeholder="Bill #" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col min-h-0">
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Entry Bar */}
                        <div className="p-4 bg-orange-50 border-b border-orange-100 grid grid-cols-12 gap-3 items-end">
                            <div className="col-span-4 relative">
                                <label className="text-xs font-bold text-orange-800 uppercase">Product</label>
                                <div className="relative">
                                    <input
                                        className="w-full h-9 text-sm border border-orange-200 rounded px-2"
                                        placeholder="Search Product..."
                                        value={currentItem.productName}
                                        onChange={(e) => {
                                            setCurrentItem(prev => ({ ...prev, productName: e.target.value }));
                                            searchProducts(e.target.value);
                                        }}
                                    />
                                    {productSearchResults.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border shadow-lg rounded-md mt-1 z-50 max-h-60 overflow-y-auto">
                                            {productSearchResults.map(p => (
                                                <div key={p.Pcode} className="p-2 hover:bg-orange-50 cursor-pointer text-sm" onClick={() => selectProduct(p)}>
                                                    <span>{p.ProductName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-orange-800 uppercase">Return Qty</label>
                                <input className="w-full h-9 text-sm border border-orange-200 rounded px-2" type="number" value={currentItem.returnQty} onChange={e => setCurrentItem({ ...currentItem, returnQty: parseInt(e.target.value) || 1 })} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-orange-800 uppercase">Refund Amt</label>
                                <input className="w-full h-9 text-sm border border-orange-200 rounded px-2" disabled value={((currentItem.returnQty * currentItem.price) - currentItem.discount).toFixed(2)} />
                            </div>
                            <div className="col-span-2">
                                <Button className="w-full h-9 bg-orange-600 hover:bg-orange-700 text-white" onClick={addItem}>Add Return</Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-slate-50/50">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-slate-500 font-medium border-b sticky top-0 shadow-sm z-10">
                                    <tr>
                                        <th className="px-4 py-3">Product Name</th>
                                        <th className="px-4 py-3 text-right">Ret. Qty</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Refund Total</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-medium text-slate-900">{item.productName}</td>
                                            <td className="px-4 py-2 text-right">{item.returnQty}</td>
                                            <td className="px-4 py-2 text-right">{item.price}</td>
                                            <td className="px-4 py-2 text-right font-bold text-orange-600">{item.totalRefund.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-slate-200 bg-white p-4 flex justify-end">
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-bold text-slate-700">Total Refund: <span className="text-orange-600">{items.reduce((acc, i) => acc + i.totalRefund, 0).toFixed(2)}</span></span>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave}>Process Return</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    );
};

export default ReturnBilling;
