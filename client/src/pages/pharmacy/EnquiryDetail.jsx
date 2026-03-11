import React, { useState, useEffect } from 'react';
import { Search, Plus, Save, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const EnquiryDetail = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [formData, setFormData] = useState({
        eDate: new Date().toISOString().split('T')[0],
        regarding: '', description: '', person: '', contact: '', remark: ''
    });

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try { const res = await fetch('/api/pharmacy/enquiries'); setEnquiries(await res.json()); } catch (e) { }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/pharmacy/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Enquiry Added");
                fetchEnquiries();
                setFormData({ eDate: new Date().toISOString().split('T')[0], regarding: '', description: '', person: '', contact: '', remark: '' });
            }
        } catch (e) { }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enquiry Details</h1>
                    <p className="text-slate-500">Track general enquiries and follow-ups.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="h-fit">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Plus className="w-5 h-5 text-green-500" /> New Enquiry
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                    <input type="date" name="eDate" value={formData.eDate} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Person Name</label>
                                    <input name="person" value={formData.person} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="Full Name" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Contact</label>
                                    <input name="contact" value={formData.contact} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="Phone / Email" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Regarding</label>
                                    <select name="regarding" value={formData.regarding} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm">
                                        <option value="">Select Topic</option>
                                        <option>Product Availability</option>
                                        <option>Price Enquiry</option>
                                        <option>General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full h-20 rounded-lg border-slate-300 text-sm p-2" placeholder="Details..."></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Remark</label>
                                    <input name="remark" value={formData.remark} onChange={handleChange} className="w-full h-10 rounded-lg border-slate-300 text-sm" placeholder="Notes" />
                                </div>
                            </div>
                            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" onClick={handleSubmit}>
                                <Save className="w-4 h-4 mr-2" /> Save Enquiry
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-0 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Person</th>
                                                <th className="px-6 py-4">Regarding</th>
                                                <th className="px-6 py-4">Contact</th>
                                                <th className="px-6 py-4">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {enquiries.map((e, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 text-slate-600">{e.eDate && e.eDate.split('T')[0]}</td>
                                                    <td className="px-6 py-4 font-medium text-slate-900">{e.Person}</td>
                                                    <td className="px-6 py-4 text-slate-600 badge"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{e.Regarding}</span></td>
                                                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{e.Contact}</td>
                                                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{e.Description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EnquiryDetail;
