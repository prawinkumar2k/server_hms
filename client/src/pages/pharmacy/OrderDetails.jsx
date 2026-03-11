import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package, Send, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Receipt State
    const [receivedQtys, setReceivedQtys] = useState({}); // { itemId: qty }
    const [isReceiving, setIsReceiving] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/pharmacy/orders/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setOrder(await res.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const submitOrder = async () => {
        if (!window.confirm("Submit this order? Status will change to ORDERED.")) return;
        try {
            const res = await fetch(`/api/pharmacy/orders/${id}/submit`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                fetchOrder();
                alert("Order Submitted!");
            }
        } catch (e) { console.error(e); }
    };

    const confirmReceipt = async () => {
        const itemsToReceive = Object.keys(receivedQtys).map(key => ({
            itemId: key,
            receivedQty: parseInt(receivedQtys[key])
        })).filter(i => i.receivedQty > 0);

        if (itemsToReceive.length === 0) return alert("Enter received quantities.");

        if (!window.confirm(`Confirm receipt of ${itemsToReceive.length} items? This will update LIVE STOCK.`)) return;

        try {
            const res = await fetch(`/api/pharmacy/orders/${id}/receive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ items: itemsToReceive })
            });

            if (res.ok) {
                alert("Stock Updated Successfully!");
                setReceivedQtys({});
                setIsReceiving(false);
                fetchOrder();
            } else {
                alert("Failed to update stock");
            }
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!order) return <div className="p-10 text-center text-red-500">Order not found</div>;

    const showReceiveControls = ['ORDERED', 'PARTIALLY_RECEIVED'].includes(order.order_status);

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/pharma-master/stock-orders')}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Order #{order.order_number}</h1>
                            <p className="text-slate-500 text-sm">Created on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-100 rounded-full font-bold text-slate-600 text-sm">{order.order_status}</span>
                        {order.order_status === 'DRAFT' && (
                            <Button onClick={submitOrder} className="bg-indigo-600 text-white shadow-lg animate-pulse">
                                <Send className="w-4 h-4 mr-2" /> Submit Order
                            </Button>
                        )}
                        {showReceiveControls && !isReceiving && (
                            <Button onClick={() => setIsReceiving(true)} className="bg-emerald-600 text-white">
                                <Package className="w-4 h-4 mr-2" /> Receive Stock
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-0 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Product</th>
                                            <th className="px-6 py-3 text-center">Ordered</th>
                                            <th className="px-6 py-3 text-center">Received</th>
                                            <th className="px-6 py-3 text-right">Unit Price</th>
                                            {isReceiving && <th className="px-6 py-3 text-center bg-emerald-50 text-emerald-700">Enter Receipt</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {order.items.map(item => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-700">{item.ProductName}</p>
                                                    <p className="text-xs text-slate-400">Current Stock: {item.current_stock}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium">{item.ordered_quantity}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-bold ${item.received_quantity >= item.ordered_quantity ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {item.received_quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">₹{item.unit_price}</td>
                                                {isReceiving && (
                                                    <td className="px-6 py-4 text-center bg-emerald-50/30">
                                                        {item.received_quantity < item.ordered_quantity ? (
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={item.ordered_quantity - item.received_quantity}
                                                                className="w-20 p-1 border border-emerald-300 rounded text-center font-bold"
                                                                placeholder="Qty"
                                                                onChange={(e) => setReceivedQtys({ ...receivedQtys, [item.id]: e.target.value })}
                                                            />
                                                        ) : (
                                                            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        {isReceiving && (
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex justify-between items-center shadow-lg animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="font-bold text-emerald-800">Updating Stock Inventory</p>
                                        <p className="text-xs text-emerald-600">Stock will be increased immediately upon confirmation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => setIsReceiving(false)} className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100">Cancel</Button>
                                    <Button onClick={confirmReceipt} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                                        Confirm & Update Stock
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Supplier Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Supplier Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Name</p>
                                        <p className="font-medium text-slate-700">{order.supplier_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Contact Person</p>
                                        <p className="font-medium text-slate-700">{order.contact_person || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="font-medium text-slate-700">{order.supplier_phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="font-medium text-slate-700">{order.supplier_email || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Order Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Created By</p>
                                        <p className="font-medium text-slate-700">{order.created_by_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Total Amount</p>
                                        <p className="text-xl font-bold text-indigo-600">₹{order.total_amount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default OrderDetails;
