import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, Save, X, Trash2, Box, Info, DollarSign, Layers, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const ProductMaster = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        pCode: '', productName: '', description: '', amount: '', stock: '', reOrder: '', scale: 'Nos'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/inventory/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                stock: parseInt(formData.stock) || 0,
                reOrder: parseInt(formData.reOrder) || 0,
                amount: parseFloat(formData.amount) || 0
            };

            const res = await fetch('/api/inventory/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchProducts();
                setIsFormOpen(false);
                setFormData({ pCode: '', productName: '', description: '', amount: '', stock: '', reOrder: '', scale: 'Nos' });
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const openDeleteModal = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await fetch(`/api/inventory/products/${itemToDelete}`, { method: 'DELETE' });
            fetchProducts();
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-100/50 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-900 tracking-tight">Product Inventory</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Manage lab consumables, reagents, and stock levels.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className={`${isFormOpen ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'} transition-all`}
                        >
                            {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isFormOpen ? 'Cancel Entry' : 'Add Item'}
                        </Button>
                    </div>
                </div>

                {/* Low Stock Alert Banner */}
                {products.some(p => (parseFloat(p.Stock || 0) <= parseFloat(p.ReOrder || 0))) && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-pulse-slow mx-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-red-900 font-bold">Low Stock Alert</h3>
                                <p className="text-red-700 text-sm">
                                    <span className="font-bold">
                                        {products.filter(p => (parseFloat(p.Stock || 0) <= parseFloat(p.ReOrder || 0))).length}
                                    </span> items are below re-order level. Please raise indents immediately.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => setSearchTerm('LOW_STOCK')}
                        >
                            View Items
                        </Button>
                    </div>
                )}

                {/* Collapsible Form */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Card className="border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/20 relative overflow-hidden">

                        <CardHeader className="pb-6 border-b border-blue-100/50 relative z-10">
                            <CardTitle className="text-lg text-blue-950 flex items-center gap-2">
                                <Box className="h-5 w-5 text-blue-600" />
                                Product Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Section 1: Identification */}
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Code</label>
                                    <input
                                        name="pCode"
                                        value={formData.pCode}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all font-mono"
                                        placeholder="e.g. TUB001"
                                    />
                                </div>
                                <div className="md:col-span-6 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Name</label>
                                    <input
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all font-bold text-slate-700"
                                        placeholder="e.g. Vacutainer Tubes (Red)"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unit / Scale</label>
                                    <select
                                        name="scale"
                                        value={formData.scale}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm transition-all"
                                    >
                                        <option>Nos</option>
                                        <option>Strips</option>
                                        <option>Bottles</option>
                                        <option>Box</option>
                                        <option>Pack</option>
                                    </select>
                                </div>

                                {/* Section 2: Details */}
                                <div className="md:col-span-12 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                                    <input
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                                        placeholder="Optional details..."
                                    />
                                </div>

                                {/* Section 3: Inventory Control (Highlighted) */}
                                <div className="md:col-span-3 space-y-1.5 bg-blue-50/50 p-2 rounded-lg -mx-1 border border-blue-100/50">
                                    <label className="text-xs font-bold text-blue-700 uppercase tracking-wide">Initial Stock</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                                        <input
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            type="number"
                                            className="w-full h-11 pl-9 rounded-xl border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-1.5 bg-blue-50/50 p-2 rounded-lg -mx-1 border border-blue-100/50">
                                    <label className="text-xs font-bold text-blue-700 uppercase tracking-wide">Re-Order Level</label>
                                    <div className="relative">
                                        <Info className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                                        <input
                                            name="reOrder"
                                            value={formData.reOrder}
                                            onChange={handleInputChange}
                                            type="number"
                                            className="w-full h-11 pl-9 rounded-xl border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>

                                {/* Section 4: Pricing */}
                                <div className="md:col-span-6 space-y-1.5 bg-slate-50 p-2 rounded-lg -mx-1 border border-slate-100">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Rate (₹)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            type="number"
                                            className="w-full h-11 pl-9 rounded-xl border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-slate-700 font-bold text-right transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-12 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                    <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-slate-700">Cancel</Button>
                                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 px-8 h-11 rounded-xl font-bold tracking-wide transition-all hover:scale-[1.02]">
                                        <Save className="h-4 w-4 mr-2" /> Save Product
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-center">Stock Level</th>
                                        <th className="px-6 py-4 text-center">Re-Order</th>
                                        <th className="px-6 py-4 text-right">Rate</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading Inventory...</td></tr>
                                    ) : products.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">No products found.</td></tr>
                                    ) : (
                                        products.filter(p => {
                                            const stock = parseFloat(p.Stock || 0);
                                            const reOrder = parseFloat(p.ReOrder || 0);
                                            const isLow = stock <= reOrder;

                                            if (searchTerm === 'LOW_STOCK') {
                                                return isLow;
                                            }

                                            return (p.ProductName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                                (p.Pcode?.toLowerCase() || '').includes(searchTerm.toLowerCase());
                                        }).map((product, index) => {
                                            const stock = parseFloat(product.Stock || 0);
                                            const reOrder = parseFloat(product.ReOrder || 0);
                                            const isLow = stock <= reOrder;

                                            return (
                                                <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{product.Pcode}</td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-100">
                                                                {(product.ProductName || '?').charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-slate-700">{product.ProductName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-slate-500">{product.Description || '-'}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isLow ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                            {product.Stock} {product.Scale}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-center text-slate-400 font-mono text-xs">{product.ReOrder}</td>
                                                    <td className="px-6 py-3 text-right font-bold text-slate-700">
                                                        {product.Amount ? `₹ ${product.Amount}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openDeleteModal(product.Pcode)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                {/* Delete Confirmation Modal */}
                {deleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                            <div className="p-6 text-center">
                                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product?</h3>
                                <p className="text-slate-500 text-sm mb-6">
                                    Are you sure you want to delete <span className="font-bold text-slate-700">{itemToDelete}</span>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="border-slate-200">Cancel</Button>
                                    <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200">Yes, Delete</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};
export default ProductMaster;
