import React, { useState } from 'react';
import { Search, Plus, Filter, User, Save, RefreshCw, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const PatientDetails = () => {
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [patients] = useState([
        { id: 197, name: 'RAVI', mobile: '9443695958', address: 'GOPI', doctor: 'DR.KUMARAN', age: 47, gender: 'Male' },
        { id: 196, name: 'S.Q. ALI', mobile: '9845123456', address: 'RASIPURAM', doctor: 'DR.KUMARAN', age: 25, gender: 'Male' },
    ]);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Details</h1>
                        <p className="text-slate-500">Register new patients and manage records.</p>
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`gap-2 ${isFormOpen ? 'bg-slate-100 text-slate-700' : 'bg-primary-600 text-white'}`}
                    >
                        {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isFormOpen ? 'Close Form' : 'New Patient'}
                    </Button>
                </div>

                {isFormOpen && (
                    <Card className="border-primary-100 shadow-md">
                        <CardHeader className="bg-primary-50/50 border-b border-primary-100 pb-3">
                            <CardTitle className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                                <User className="h-4 w-4 text-primary-600" />
                                Patient Registration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Patient ID</label>
                                    <input type="text" className="w-full h-10 rounded-lg border-slate-300 bg-slate-50 text-slate-500 text-sm focus:ring-primary-500 shadow-sm" value="198" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Mobile No</label>
                                    <input type="tel" className="w-full h-10 rounded-lg border-slate-300 text-sm focus:ring-primary-500 shadow-sm" />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Patient Name</label>
                                    <input type="text" className="w-full h-10 rounded-lg border-slate-300 text-sm focus:ring-primary-500 shadow-sm" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Age</label>
                                    <input type="number" className="w-full h-10 rounded-lg border-slate-300 text-sm focus:ring-primary-500 shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Gender</label>
                                    <select className="w-full h-10 rounded-lg border-slate-300 text-sm focus:ring-primary-500 shadow-sm">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Ref By (Doctor)</label>
                                    <div className="flex gap-2">
                                        <select className="flex-1 h-10 rounded-lg border-slate-300 text-sm focus:ring-primary-500 shadow-sm">
                                            <option>DR. KUMARAN</option>
                                            <option>DR. OTHER</option>
                                        </select>
                                        <Button variant="outline" className="px-3 border-slate-300 text-primary-600 bg-white hover:bg-primary-50">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2 lg:col-span-4">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Address</label>
                                    <input type="text" className="w-full h-10 rounded-lg border-slate-300 text-sm focus:ring-primary-500 shadow-sm" />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200">
                                    <Save className="h-4 w-4 mr-2" />
                                    Register Patient
                                </Button>
                                <Button variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Update
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input type="text" placeholder="Search patients..." className="w-full pl-10 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 shadow-sm" />
                            </div>
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto rounded-b-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 border-b">ID</th>
                                    <th className="px-6 py-3 border-b">Patient Info</th>
                                    <th className="px-6 py-3 border-b">Contact</th>
                                    <th className="px-6 py-3 border-b">Doctor</th>
                                    <th className="px-6 py-3 border-b text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {patients.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-500">{p.age} Y / {p.gender}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700">{p.mobile}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[150px]">{p.address}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{p.doctor}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button size="sm" variant="ghost" className="text-primary-600 hover:bg-primary-50">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </PageTransition>
    );
};

export default PatientDetails;
