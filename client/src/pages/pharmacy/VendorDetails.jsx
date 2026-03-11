import React, { useState, useEffect } from 'react';
import { Search, Plus, Save, Trash2, Edit2, Truck, Phone, User, Building } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const VendorDetails = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        companyName: '', person: '', address: '', mobile: '', contact: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, vendorId: null });

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await fetch('/api/pharmacy/vendors');
            const data = await res.json();
            setVendors(data);
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
        try {
            const url = editingId
                ? `/api/pharmacy/vendors/${editingId}`
                : '/api/pharmacy/vendors';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchVendors();
                setFormData({ companyName: '', person: '', address: '', mobile: '', contact: '' });
                setEditingId(null);
                showToast(editingId ? "Vendor updated successfully!" : "Vendor added successfully!", 'success');
            } else {
                showToast('Failed to save vendor. Please try again.', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('An error occurred. Please try again.', 'error');
        }
    };

    const handleEdit = (vendor) => {
        setFormData({
            companyName: vendor.CompanyName,
            person: vendor.Person,
            address: vendor.Address,
            mobile: vendor.MobileNo,
            contact: vendor.Contact
        });
        setEditingId(vendor.SNo);
    };

    const handleDelete = (id) => {
        setConfirmDialog({ isOpen: true, vendorId: id });
    };

    const confirmDelete = async () => {
        const id = confirmDialog.vendorId;
        try {
            const res = await fetch(`/api/pharmacy/vendors/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchVendors();
                showToast('Vendor deleted successfully!', 'success');
            } else {
                showToast('Failed to delete vendor.', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('An error occurred while deleting.', 'error');
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, vendorId: null })}
                onConfirm={confirmDelete}
                title="Delete Vendor"
                message="Are you sure you want to delete this vendor? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
            <PageTransition>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Details</h1>
                        <p className="text-slate-500">Manage pharmacy suppliers and vendors.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form */}
                        <Card className="h-fit">
                            <CardContent className="p-6 space-y-4">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    {editingId ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                                    {editingId ? 'Edit Vendor' : 'New Vendor'}
                                </h2>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <input
                                                name="companyName" value={formData.companyName} onChange={handleChange}
                                                className="w-full pl-9 h-10 rounded-lg border-slate-300 text-sm" placeholder="Company Name"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Contact Person</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <input
                                                name="person" value={formData.person} onChange={handleChange}
                                                className="w-full pl-9 h-10 rounded-lg border-slate-300 text-sm" placeholder="Contact Person"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                                        <div className="relative">
                                            <Truck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <input
                                                name="address" value={formData.address} onChange={handleChange}
                                                className="w-full pl-9 h-10 rounded-lg border-slate-300 text-sm" placeholder="Address"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Mobile No</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <input
                                                    name="mobile" value={formData.mobile} onChange={handleChange}
                                                    className="w-full pl-9 h-10 rounded-lg border-slate-300 text-sm" placeholder="Mobile"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Land Line</label>
                                            <input
                                                name="contact" value={formData.contact} onChange={handleChange}
                                                className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="Landline"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" onClick={handleSubmit}>
                                    {editingId ? "Update Vendor" : "Add Vendor"}
                                </Button>
                                {editingId && (
                                    <Button variant="ghost" className="w-full text-slate-500" onClick={() => {
                                        setEditingId(null);
                                        setFormData({ companyName: '', person: '', address: '', mobile: '', contact: '' });
                                    }}>Cancel</Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* List */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-0 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4">Company Name</th>
                                                    <th className="px-6 py-4">Person</th>
                                                    <th className="px-6 py-4">Address</th>
                                                    <th className="px-6 py-4">Mobile</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {vendors.map((v) => (
                                                    <tr key={v.SNo} className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-4 font-medium text-slate-900">{v.CompanyName}</td>
                                                        <td className="px-6 py-4 text-slate-600">{v.Person}</td>
                                                        <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{v.Address}</td>
                                                        <td className="px-6 py-4 font-mono text-slate-500">{v.MobileNo}</td>
                                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                            <button onClick={() => handleEdit(v)}><Edit2 className="w-4 h-4 text-blue-500" /></button>
                                                            <button onClick={() => handleDelete(v.SNo)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {vendors.length === 0 && !loading && (
                                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No vendors found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </>
    );
};

export default VendorDetails;
