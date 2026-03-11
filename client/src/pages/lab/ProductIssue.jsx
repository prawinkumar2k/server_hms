import React, { useState, useEffect } from 'react';
import { Search, Plus, Activity, Save, X, Calendar, User, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import DataTable from '../../components/common/DataTable';

const ProductIssue = () => {
    const [issues, setIssues] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        pname: '', // Product Name
        issueTo: 'Main Lab',
        issueQty: '',
        pcode: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issuesRes, productsRes] = await Promise.all([
                fetch('/api/inventory/issues'),
                fetch('/api/inventory/products')
            ]);
            const iData = await issuesRes.json();
            const pData = await productsRes.json();
            setIssues(Array.isArray(iData) ? iData : []);
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
                pcode: product.Pcode
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/inventory/issues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Stock Issued Successfully');
                fetchData();
                setIsFormOpen(false);
                setFormData({ pname: '', issueTo: 'Main Lab', issueQty: '', pcode: '' });
            }
        } catch (error) { console.error(error); }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header - Purple Theme */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-purple-100/50 rounded-lg">
                                <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-purple-900 tracking-tight">Stock Issue Register</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Track inventory distribution and department issues.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className={`${isFormOpen ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200'} transition-all`}
                        >
                            {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isFormOpen ? 'Cancel Issue' : 'Issue Stock'}
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Card className="border-purple-100 shadow-xl bg-gradient-to-br from-white to-purple-50/20 relative overflow-hidden">
                        <CardHeader className="pb-6 border-b border-purple-100/50 relative z-10">
                            <CardTitle className="text-lg text-purple-950 flex items-center gap-2">
                                <Package className="h-5 w-5 text-purple-600" />
                                Issue Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Product</label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <select
                                            name="pname"
                                            value={formData.pname}
                                            onChange={handleProductSelect}
                                            className="w-full h-11 pl-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white shadow-sm"
                                        >
                                            <option value="">-- Choose Product --</option>
                                            {products.map(p => (
                                                <option key={p.Pcode} value={p.ProductName}>{p.ProductName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Issue Quantity</label>
                                    <input
                                        name="issueQty"
                                        value={formData.issueQty}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm font-bold text-slate-700"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Issue To</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            name="issueTo"
                                            value={formData.issueTo}
                                            onChange={handleInputChange}
                                            className="w-full h-11 pl-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm"
                                            placeholder="Department"
                                        />
                                    </div>
                                </div>
                                <div className="hidden"><input name="pcode" value={formData.pcode} readOnly /></div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 h-11 px-8 rounded-xl">
                                    <Save className="h-4 w-4 mr-2" /> Confirm Issue
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
                                        <th className="px-6 py-4">Ref ID</th>
                                        <th className="px-6 py-4">Product Issued</th>
                                        <th className="px-6 py-4">Issue Date</th>
                                        <th className="px-6 py-4">Issued To</th>
                                        <th className="px-6 py-4 text-center">Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading History...</td></tr>
                                    ) : issues.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No issue history found.</td></tr>
                                    ) : (
                                        issues.filter(item =>
                                            (item.pname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (item.issueTo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (item.ID?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                        ).map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-xs text-slate-400">#{item.ID}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-100">
                                                            {(item.pname || '?').charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{item.pname}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-500">
                                                    {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-6 py-3 font-medium text-purple-700 bg-purple-50/50 w-fit rounded block my-2">
                                                    {item.issueTo}
                                                </td>
                                                <td className="px-6 py-3 text-center font-bold text-slate-800">{item.issueQty}</td>
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
export default ProductIssue;
