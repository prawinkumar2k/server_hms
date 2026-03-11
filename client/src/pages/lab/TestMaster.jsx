import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import PageTransition from '../../components/layout/PageTransition';

const LabMaster = () => {
    const tests = [
        { id: 1, name: "Complete Blood Count (CBC)", category: "Hematology", range: "4.5-5.5", unit: "M/uL", price: 25.00, status: "Active" },
        { id: 2, name: "Lipid Profile", category: "Biochemistry", range: "< 200", unit: "mg/dL", price: 45.00, status: "Active" },
        { id: 3, name: "Blood Sugar (Fasting)", category: "Biochemistry", range: "70-100", unit: "mg/dL", price: 15.00, status: "Active" },
        { id: 4, name: "Thyroid Profile (T3, T4, TSH)", category: "Hormonal", range: "0.4-4.0", unit: "mIU/L", price: 60.00, status: "Active" },
        { id: 5, name: "Urine Routine", category: "Pathology", range: "N/A", unit: "-", price: 10.00, status: "Active" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Master</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage laboratory tests and pricing</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Test
                </Button>
            </div>

            <Card>
                <CardHeader className="space-y-0 pb-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search tests..." className="pl-10" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Test Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Normal Range</th>
                                    <th className="px-6 py-4">Price ($)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {tests.map((test) => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {test.name}
                                            <div className="text-xs text-slate-400 font-normal mt-0.5">Unit: {test.unit}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{test.category}</td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">{test.range}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">${test.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="success" className="bg-green-50 text-green-700 border-green-200">
                                                {test.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LabMaster;
