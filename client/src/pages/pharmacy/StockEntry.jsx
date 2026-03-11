import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Package, AlertTriangle, CheckCircle2, X, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const StockEntry = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        productName: '', description: '', amount: '', stock: '', reOrder: '', scale: 'Nos', expiryDate: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/pharmacy/products');
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.productName.trim()) {
            showToast('Product name is required');
            return;
        }
        try {
            const url = editingId
                ? `/api/pharmacy/products/${editingId}`
                : '/api/pharmacy/products';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchProducts();
                setFormData({ productName: '', description: '', amount: '', stock: '', reOrder: '', scale: 'Nos', expiryDate: '' });
                setEditingId(null);
                showToast(editingId ? "Stock Updated" : "Product Added");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleEdit = (prod) => {
        setFormData({
            productName: prod.ProductName,
            description: prod.Description,
            amount: prod.Amount,
            stock: prod.Stock,
            reOrder: prod.ReOrder,
            scale: prod.Scale || 'Nos',
            expiryDate: prod.ExpiryDate ? new Date(prod.ExpiryDate).toISOString().split('T')[0] : ''
        });
        setEditingId(prod.Pcode);
    };

    const handleDelete = (id) => {
        setDeleteModal(id);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/pharmacy/products/${deleteModal}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
            showToast('Product Deleted');
        } catch (e) { console.error(e); }
        setDeleteModal(null);
    };

    const filteredProducts = products.filter(p => {
        if (searchTerm === 'LOW_STOCK') {
            return Number(p.Stock || 0) <= Number(p.ReOrder || 0);
        }
        return p.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.Description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <PageTransition>
            <div className="space-y-6 pb-10 relative">
                {/* Toast Notification */}
                {toast && (
                    <div className="fixed top-6 right-6 z-50 animate-slideIn">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-2xl rounded-xl px-5 py-4 min-w-[280px]">
                            <div className="p-1.5 bg-emerald-100 rounded-full">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800">{toast}</p>
                                <p className="text-xs text-slate-500">Operation completed successfully</p>
                            </div>
                            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Stock</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage inventory, prices, and fast-moving items.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert Banner */}
                {products.some(p => (Number(p.Stock || 0) <= Number(p.ReOrder || 0) && Number(p.ReOrder || 0) > 0)) && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-red-900 font-bold">Low Stock Warning</h3>
                                <p className="text-red-700 text-sm">
                                    <span className="font-bold">
                                        {products.filter(p => (Number(p.Stock || 0) <= Number(p.ReOrder || 0) && Number(p.ReOrder || 0) > 0)).length}
                                    </span> medicine(s) are running low or out of stock.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => setSearchTerm('LOW_STOCK')}
                        >
                            View Low Stock
                        </Button>
                    </div>
                )}


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add/Edit Form - Sticky on Large Screens */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-slate-200 shadow-lg">
                            <CardContent className="p-6 space-y-5">
                                <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    {editingId ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                                    {editingId ? 'Update Medicine' : 'Add New Medicine'}
                                </h2>
                                <p className="text-xs text-slate-500 -mt-2">Enter product details carefully for billing.</p>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Name</label>
                                        <div className="relative">
                                            <Package className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <input
                                                name="productName" value={formData.productName} onChange={handleChange}
                                                className="w-full pl-9 h-10 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Paracetamol 500mg"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category / Type</label>
                                        <input
                                            name="description" value={formData.description} onChange={handleChange}
                                            className="w-full h-10 px-3 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Tablet, Syrup, Injection"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Price (₹)</label>
                                            <input
                                                name="amount" value={formData.amount} onChange={handleChange}
                                                className="w-full h-10 px-3 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unit</label>
                                            <select name="scale" value={formData.scale} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white cursor-pointer">
                                                <option>Nos</option>
                                                <option>Strips</option>
                                                <option>Btls</option>
                                                <option>Pack</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Stock</label>
                                            <input
                                                name="stock" value={formData.stock} onChange={handleChange}
                                                className="w-full h-10 px-3 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="Curr. Qty"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Re-Order Lvl</label>
                                            <input
                                                name="reOrder" value={formData.reOrder} onChange={handleChange}
                                                className="w-full h-10 px-3 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="Min Limit"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Expiry Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                            <input
                                                type="date"
                                                name="expiryDate" value={formData.expiryDate} onChange={handleChange}
                                                className="w-full pl-9 h-10 rounded-lg border-slate-200 text-sm bg-slate-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 shadow-lg shadow-blue-200" onClick={handleSubmit}>
                                        {editingId ? "Update Product Details" : "Add Product to Inventory"}
                                    </Button>
                                    {editingId && (
                                        <Button variant="ghost" className="w-full mt-2 text-slate-500" onClick={() => {
                                            setEditingId(null);
                                            setFormData({ productName: '', description: '', amount: '', stock: '', reOrder: '', scale: 'Nos', expiryDate: '' });
                                        }}>Cancel Edit</Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product List Table */}
                    <div className="lg:col-span-2">
                        <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4">Medicine Name</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Stock</th>
                                                <th className="px-6 py-4 text-right">Price</th>
                                                <th className="px-6 py-4">Expiry</th>
                                                <th className="px-6 py-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredProducts.map((p) => {
                                                const isLowStock = Number(p.Stock) <= Number(p.ReOrder);
                                                const isOutOfStock = Number(p.Stock) === 0;

                                                // Expiry logic
                                                const expiryDate = p.ExpiryDate ? new Date(p.ExpiryDate) : null;
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
                                                const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;
                                                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 90;

                                                return (
                                                    <tr key={p.Pcode} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-slate-800">{p.ProductName}</div>
                                                            <div className="text-xs text-slate-500">{p.Description} • {p.Scale}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {isOutOfStock ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                                                    Out of Stock
                                                                </span>
                                                            ) : isLowStock ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                                                                    Low Stock
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                                    In Stock
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono text-slate-700 font-medium">
                                                            {p.Stock}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-medium text-slate-700">
                                                            ₹{p.Amount}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {expiryDate ? (
                                                                <div className="flex flex-col">
                                                                    <span className={`text-xs font-bold ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-slate-600'
                                                                        }`}>
                                                                        {expiryDate.toLocaleDateString()}
                                                                    </span>
                                                                    {isExpired && (
                                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 mt-0.5 w-fit">Expired</span>
                                                                    )}
                                                                    {isExpiringSoon && (
                                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 mt-0.5 w-fit">{daysUntilExpiry}d left</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-slate-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDelete(p.Pcode)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredProducts.length === 0 && !loading && (
                                                <tr><td colSpan="6" className="p-12 text-center text-slate-400">No products found matching your search.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModal !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scaleIn">
                            <div className="p-6 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Delete Product?</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        This product will be permanently removed from inventory. This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setDeleteModal(null)}>Cancel</Button>
                                    <Button className="flex-1 bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200" onClick={confirmDelete}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default StockEntry;
