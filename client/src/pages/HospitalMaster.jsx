import React, { useState, useEffect } from 'react';
import { Save, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

const HospitalMaster = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        hospital_name: '',
        branch_name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        registration_no: '',
        tax_id: '',
        currency_symbol: '$',
        date_format: 'MM/DD/YYYY'
    });

    useEffect(() => {
        fetch('/api/admin/hospital')
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setFormData({
                        hospital_name: data.hospital_name || '',
                        branch_name: data.branch_name || '',
                        address: data.address || '',
                        phone: data.phone || '',
                        email: data.email || '',
                        website: data.website || '',
                        registration_no: data.registration_no || '',
                        tax_id: data.tax_id || '',
                        currency_symbol: data.currency_symbol || '$',
                        date_format: data.date_format || 'MM/DD/YYYY'
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch hospital profile", err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/hospital', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Hospital Profile Updated Successfully');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <Building2 className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hospital Master</h1>
                    <p className="text-slate-500 text-sm">Manage hospital details and configurations</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hospital Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading profile...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Hospital Name</label>
                                    <Input
                                        name="hospital_name"
                                        value={formData.hospital_name}
                                        onChange={handleChange}
                                        placeholder="Enter hospital name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Branch Name</label>
                                    <Input
                                        name="branch_name"
                                        value={formData.branch_name}
                                        onChange={handleChange}
                                        placeholder="Main Branch"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter full address"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="admin@hospital.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Website</label>
                                    <Input
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Registration No.</label>
                                    <Input
                                        name="registration_no"
                                        value={formData.registration_no}
                                        onChange={handleChange}
                                        placeholder="REG-2024-XXX"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Tax ID / GST</label>
                                <Input
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={handleChange}
                                    placeholder="TAX-ID-123"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-6">
                                <h3 className="font-medium text-slate-900 mb-4">System Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Currency Symbol</label>
                                        <Input
                                            name="currency_symbol"
                                            value={formData.currency_symbol}
                                            onChange={handleChange}
                                            placeholder="$"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Date Format</label>
                                        <select
                                            name="date_format"
                                            value={formData.date_format}
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button className="gap-2" disabled={submitting} type="submit">
                                    <Save className="h-4 w-4" />
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HospitalMaster;
