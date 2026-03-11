import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Beaker, CheckCircle2, Save, RefreshCw, X, Trash2, Microscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import DataTable from '../../components/common/DataTable';

const TestMaster = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        department: 'Hematology',
        dCode: '',
        tCode: '',
        testType: '', // Test Name
        subTestName: '',
        subType: '', // Parameter
        subTCode: '', // Sub Order
        normalValues: '',
        units: '',
        amount: ''
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await fetch('/api/tests');
            const data = await res.json();
            setTests(Array.isArray(data) ? data : []);
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
            const payload = { ...formData };
            const res = await fetch('/api/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Success feedback could be a toast, for now alert
                fetchTests();
                setIsFormOpen(false);
                setFormData({
                    department: 'Hematology', dCode: '', tCode: '', testType: '', subTestName: '', subType: '', subTCode: '', normalValues: '', units: '', amount: ''
                });
            } else {
                alert('Failed to add test');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this test?')) return;
        try {
            await fetch(`/api/tests/${id}`, { method: 'DELETE' });
            fetchTests();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-100/50 rounded-lg">
                                <Microscope className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-900 tracking-tight">Lab Test Master</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Configure pathology tests, parameters, and reference ranges.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className={`${isFormOpen ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200'} transition-all`}
                        >
                            {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isFormOpen ? 'Cancel Entry' : 'New Test'}
                        </Button>
                    </div>
                </div>

                {/* Collapsible Form Section */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Card className="border-emerald-100 shadow-xl bg-gradient-to-b from-white to-emerald-50/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

                        <CardHeader className="pb-6 border-b border-emerald-100/50 relative z-10">
                            <CardTitle className="text-lg text-emerald-950 flex items-center gap-2">
                                <Beaker className="h-5 w-5 text-emerald-600" />
                                Test Definition
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6 relative z-10">
                            {/* Improved 12-Column Responsive Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                {/* Section 1: Classification */}
                                <div className="md:col-span-4 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm transition-all"
                                    >
                                        <option>Hematology</option>
                                        <option>Biochemistry</option>
                                        <option>Pathology</option>
                                        <option>Microbiology</option>
                                        <option>Serology</option>
                                        <option>Hormones</option>
                                        <option>Clinical Pathology</option>
                                        <option>Immunoassay</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Dept Code</label>
                                    <input
                                        name="dCode"
                                        value={formData.dCode}
                                        onChange={handleInputChange}
                                        placeholder="e.g. HEM"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all uppercase"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Test Code</label>
                                    <input
                                        name="tCode"
                                        value={formData.tCode}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 1001"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all font-mono"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Order</label>
                                    <input
                                        name="subTCode"
                                        type="number"
                                        value={formData.subTCode}
                                        onChange={handleInputChange}
                                        placeholder="#"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all text-center"
                                    />
                                </div>

                                {/* Section 2: Test Definition */}
                                <div className="md:col-span-6 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Test Name (Main)</label>
                                    <input
                                        name="testType"
                                        value={formData.testType}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Complete Blood Count"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="md:col-span-6 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sub Test Name / Group</label>
                                    <input
                                        name="subTestName"
                                        value={formData.subTestName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Red Blood Cells (Optional)"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                                    />
                                </div>

                                {/* Section 3: Parameters & Values */}
                                <div className="md:col-span-4 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Result Parameter</label>
                                    <input
                                        name="subType"
                                        value={formData.subType}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Hemoglobin"
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Normal Range</label>
                                    <input
                                        name="normalValues"
                                        value={formData.normalValues}
                                        onChange={handleInputChange}
                                        placeholder="Min - Max"
                                        className="w-full h-11 rounded-xl border-emerald-200 bg-emerald-50/30 text-emerald-800 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all font-medium"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Units</label>
                                    <input
                                        name="units"
                                        value={formData.units}
                                        onChange={handleInputChange}
                                        placeholder="e.g. g/dL"
                                        className="w-full h-11 rounded-xl border-emerald-200 bg-emerald-50/30 text-emerald-800 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Cost (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                                        <input
                                            name="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="w-full h-11 pl-8 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all text-right font-mono font-bold text-slate-700 bg-slate-50/50"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-12 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                    <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-slate-700">Cancel</Button>
                                    <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 px-8 h-11 rounded-xl font-bold tracking-wide transition-all hover:scale-[1.02]">
                                        <Save className="h-4 w-4 mr-2" /> Save Test
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Grid Section - Native Table */}
                <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Dept Code</th>
                                        <th className="px-6 py-4">Test Name</th>
                                        <th className="px-6 py-4">Parameter</th>
                                        <th className="px-6 py-4">Ref. Range</th>
                                        <th className="px-6 py-4">Unit</th>
                                        <th className="px-6 py-4 text-right">Cost</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading Tests...</td></tr>
                                    ) : tests.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">No tests defined.</td></tr>
                                    ) : (
                                        tests.filter(test =>
                                            (test.TestType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (test.DCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (test.Department?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                        ).map((test, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-xs text-slate-500">{test.DCode}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700">{test.TestType}</span>
                                                        <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">{test.Department}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-600 font-medium">{test.SubType || '-'}</td>
                                                <td className="px-6 py-3 text-slate-500">{test.NORMALVALUES || '-'}</td>
                                                <td className="px-6 py-3 text-slate-400">{test.Units || '-'}</td>
                                                <td className="px-6 py-3 text-right font-bold text-slate-800">
                                                    {test.Amount ? `₹ ${test.Amount}` : '-'}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => {
                                                            setFormData({
                                                                department: test.Department,
                                                                dCode: test.DCode,
                                                                tCode: test.TCode,
                                                                testType: test.TestType,
                                                                subTestName: test.SubTestName,
                                                                subType: test.SubType,
                                                                subTCode: test.SubTCode,
                                                                normalValues: test.NORMALVALUES,
                                                                units: test.Units,
                                                                amount: test.Amount
                                                            });
                                                            setIsFormOpen(true);
                                                        }} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                            <RefreshCw className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(test.ID || test.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
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

export default TestMaster;
