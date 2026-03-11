import React, { useState } from 'react';
import { Search, Plus, Filter, Package, Save, RefreshCw, X, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const ProductMaster = () => {
    const [isFormOpen, setIsFormOpen] = useState(true);
    // Mock Data based on Indent Entry screenshot
    const [indents] = useState([
        { id: 1, date: '07-Jan-2026', code: 'P001', name: 'Syringe 5ml', qty: 100, raiser: 'Admin' },
    ]);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Indent Entry (Product Master)</h1>
                        <p className="text-slate-500">Manage internal product indents and requirements.</p>
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`gap-2 ${isFormOpen ? 'bg-slate-100 text-slate-700' : 'bg-primary-600 text-white'}`}
                    >
                        {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isFormOpen ? 'Close Form' : 'New Indent'}
                    </Button>
                </div>

                {isFormOpen && (
                    <Card className="border-primary-100 shadow-md">
                        <CardHeader className="bg-primary-50/50 border-b border-primary-100 pb-3">
                            <CardTitle className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary-600" />
                                Indent Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Indent ID</label>
                                    <input type="text" className="w-full h-10 rounded-lg border-slate-300 bg-slate-50 text-slate-500 text-sm shadow-sm" defaultValue="1001" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input type="date" className="w-full pl-10 h-10 rounded-lg border-slate-300 text-sm shadow-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Indent Raised By</label>
                                    <input type="text" className="w-full h-10 rounded-lg border-slate-300 text-sm shadow-sm" placeholder="e.g. Lab Technician" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Product Code</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="w-full h-10 rounded-lg border-slate-300 text-sm shadow-sm" />
                                        <Button variant="outline" className="px-3"><Search className="h-4 w-4 text-slate-500" /></Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Product Name</label>
                                    <input type="text" className="w-full h-10 rounded-lg border-slate-300 text-sm shadow-sm bg-slate-50" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-600 uppercase">Required Quantity</label>
                                    <input type="number" className="w-full h-10 rounded-lg border-slate-300 text-sm shadow-sm" />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200">
                                    <Save className="h-4 w-4 mr-2" />
                                    Submit
                                </Button>
                                <Button variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Update
                                </Button>
                                <Button variant="ghost" className="text-slate-500 ml-auto">
                                    Close
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                        <CardTitle className="text-sm text-slate-600">Recent Indents</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto rounded-b-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 border-b">Indent ID</th>
                                    <th className="px-6 py-3 border-b">Date</th>
                                    <th className="px-6 py-3 border-b">Product Code</th>
                                    <th className="px-6 py-3 border-b">Product Name</th>
                                    <th className="px-6 py-3 border-b">Required Qty</th>
                                    <th className="px-6 py-3 border-b">Raised By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {indents.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.date}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.code}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-900 font-bold">{item.qty}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.raiser}</td>
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

export default ProductMaster;
