import React, { useState, useEffect } from 'react';
import { Search, Plus, Truck, Save, X, Calendar, Package, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import DataTable from '../../components/common/DataTable';

const IndentEntry = () => {
    const { user } = useAuth();
    const [indents, setIndents] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        pname: '', // Product Name
        pCode: '',
        requireQty: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [indentsRes, productsRes] = await Promise.all([
                fetch('/api/inventory/indents'),
                fetch('/api/inventory/products')
            ]);
            const iData = await indentsRes.json();
            const pData = await productsRes.json();
            setIndents(Array.isArray(iData) ? iData : []);
            setProducts(Array.isArray(pData) ? pData : []);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    const handleProductSelect = (e) => {
        const selectedName = e.target.value;
        const product = products.find(p => p.ProductName === selectedName);
        if (product) {
            setFormData({
                ...formData,
                pname: product.ProductName,
                pCode: product.Pcode
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/inventory/indents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Indent Raised Successfully');
                fetchData();
                setIsFormOpen(false);
                setFormData({ pname: '', pCode: '', requireQty: '' });
            }
        } catch (error) { console.error(error); }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch(`/api/inventory/indents/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) { console.error(error); }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header - Orange Theme */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-orange-100/50 rounded-lg">
                                <Truck className="h-6 w-6 text-orange-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-orange-900 tracking-tight">Stock Indent Request</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Raise requests for new stock procurement.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search indents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                            />
                        </div>
                        {user?.role !== 'LAB_MASTER' && (
                            <Button
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className={`${isFormOpen ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200'} transition-all`}
                            >
                                {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                {isFormOpen ? 'Cancel Request' : 'Raise Indent'}
                            </Button>
                        )}
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
                            onClick={() => {
                                // Optional: Auto-filter or open form with first low stock item?
                                // User just asked to show it. For now, we can just let them view clearly.
                                // Or just leave button which currently does nothing or maybe scrolls to form?
                                setIsFormOpen(true);
                            }}
                        >
                            Raise Indent
                        </Button>
                    </div>
                )}

                {/* Form */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Card className="border-orange-100 shadow-xl bg-gradient-to-br from-white to-orange-50/20 relative overflow-hidden">
                        <CardHeader className="pb-6 border-b border-orange-100/50 relative z-10">
                            <CardTitle className="text-lg text-orange-950 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                New Indent Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Product</label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <select
                                            name="pname"
                                            value={formData.pname}
                                            onChange={handleProductSelect}
                                            className="w-full h-11 pl-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white shadow-sm"
                                        >
                                            <option value="">-- Choose Product --</option>
                                            {products.map(p => (
                                                <option key={p.Pcode} value={p.ProductName}>{p.ProductName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Required Quantity</label>
                                    <input
                                        name="requireQty"
                                        value={formData.requireQty}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm font-bold text-slate-700"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-1.5 hidden">
                                    <input name="pCode" value={formData.pCode} readOnly className="input" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 h-11 px-8 rounded-xl">
                                    <Save className="h-4 w-4 mr-2" /> Submit Request
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid - Native Table */}
                <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Req #</th>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Item Code</th>
                                        <th className="px-6 py-4 text-center">Qty</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        {(user?.role === 'LAB_MASTER' || user?.role === 'Admin') && (
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading Indents...</td></tr>
                                    ) : indents.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No requests raised.</td></tr>
                                    ) : (
                                        indents.filter(i =>
                                            (i.pname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (i.indentID?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                        ).map((indent, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-xs text-slate-400">#{indent.indentID}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold border border-orange-100">
                                                            {(indent.pname || '?').charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{indent.pname}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-500">
                                                    {indent.indentDate ? new Date(indent.indentDate).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-6 py-3 font-mono text-slate-400 text-xs">{indent.pCode}</td>
                                                <td className="px-6 py-3 text-center font-bold text-slate-800">{indent.requireQty}</td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${indent.status === 'Approved' || indent.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        indent.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}>
                                                        {indent.status || 'Pending'}
                                                    </span>
                                                </td>
                                                {(user?.role === 'LAB_MASTER' || user?.role === 'Admin') && (
                                                    <td className="px-6 py-3 text-center">
                                                        {indent.status !== 'Approved' && indent.status !== 'Rejected' && indent.status !== 'Completed' && (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleStatusUpdate(indent.indentID, 'Completed')}
                                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                                    title="Approve & Complete"
                                                                >
                                                                    <CheckCircle className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(indent.indentID, 'Rejected')}
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                    title="Reject"
                                                                >
                                                                    <XCircle className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    );
};
export default IndentEntry;
