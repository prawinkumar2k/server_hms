import React, { useState, useEffect } from 'react';
import { Plus, Search, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';
import { useAuth } from '../../context/AuthContext';

const Suppliers = () => {
    const { user } = useAuth();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: '', phone: '', email: '', address: '' });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/pharmacy/suppliers', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setSuppliers(await res.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/pharmacy/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                fetchSuppliers();
                setFormData({ name: '', contact: '', phone: '', email: '', address: '' });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Supplier Management</h1>
                        <p className="text-slate-500 text-sm">Manage medicine suppliers and vendors.</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Supplier
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? <div className="text-center py-10">Loading...</div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuppliers.map(s => (
                            <Card key={s.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded uppercase">Active</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{s.supplier_name}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{s.contact_person}</p>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            {s.phone}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {s.email || 'N/A'}
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <span className="truncate">{s.address || 'No Address'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" className="w-full p-2 border rounded-lg" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <textarea className="w-full p-2 border rounded-lg" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-indigo-600 text-white">Create Supplier</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Suppliers;
