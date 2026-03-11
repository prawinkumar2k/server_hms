import React, { useState, useEffect } from 'react';
import { BadgeDollarSign, User, Save, Edit, X, Calculator } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const SalaryDetails = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const initialSalary = {
        basic: 0, hra: 0, da: 0, travel: 0, medical: 0, special: 0,
        pf: 0, esi: 0, pt: 0, tds: 0
    };
    const [formData, setFormData] = useState(initialSalary);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/payroll/salaries', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setEmployees(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleEdit = async (emp) => {
        setSelectedEmp(emp);
        try {
            const res = await fetch(`/api/payroll/salaries/${emp.employee_id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const salary = await res.json();
            setFormData({
                basic: salary.basic_salary || 0,
                hra: salary.hra || 0,
                da: salary.da || 0,
                travel: salary.travel_allowance || 0,
                medical: salary.medical_allowance || 0,
                special: salary.special_allowance || 0,
                pf: salary.pf_employee || 0,
                esi: salary.esi_employee || 0,
                pt: salary.pt || 0,
                tds: salary.tds || 0
            });
            setIsSheetOpen(true);
        } catch (e) { console.error(e); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    };

    const calculateTotals = () => {
        const gross = (formData.basic + formData.hra + formData.da + formData.travel + formData.medical + formData.special);
        const deductions = (formData.pf + formData.esi + formData.pt + formData.tds);
        return { gross, deductions, net: gross - deductions };
    };

    const { gross, deductions, net } = calculateTotals();

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/payroll/salaries/${selectedEmp.employee_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchData();
                setIsSheetOpen(false);
            } else {
                alert('Failed to update salary');
            }
        } catch (e) { console.error(e); }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-100/50 rounded-lg">
                                <BadgeDollarSign className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-900 tracking-tight">Salary Structures</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Manage master salary components for all employees.</p>
                    </div>
                </div>

                {/* Main Content: Split View */}
                <div className="flex gap-6 h-[calc(100vh-200px)]">

                    {/* List Section */}
                    <div className={`flex-1 transition-all duration-300 ${isSheetOpen ? 'w-2/3' : 'w-full'}`}>
                        <Card className="h-full border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Employee Directory</h3>
                                </div>
                                <div className="flex-1 overflow-auto custom-scrollbar">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white sticky top-0 z-10 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Employee</th>
                                                <th className="px-6 py-3">Designation</th>
                                                <th className="px-6 py-3 text-right">Gross Salary</th>
                                                <th className="px-6 py-3 text-right">Net Pay</th>
                                                <th className="px-6 py-3 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {loading ? <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading...</td></tr> :
                                                employees.map(emp => (
                                                    <tr key={emp.employee_id} className={`hover:bg-slate-50 transition-colors ${selectedEmp?.employee_id === emp.employee_id ? 'bg-emerald-50/30' : ''}`}>
                                                        <td className="px-6 py-3">
                                                            <div className="font-bold text-slate-700">{emp.first_name} {emp.last_name}</div>
                                                            <div className="text-xs text-slate-400 font-mono">{emp.employee_code}</div>
                                                        </td>
                                                        <td className="px-6 py-3 text-slate-500 text-xs">{emp.department} • {emp.designation}</td>
                                                        <td className="px-6 py-3 text-right font-mono text-slate-600">
                                                            {emp.gross_salary ? `₹${Number(emp.gross_salary).toLocaleString()}` : '-'}
                                                        </td>
                                                        <td className="px-6 py-3 text-right font-bold text-emerald-600 font-mono">
                                                            {emp.net_salary ? `₹${Number(emp.net_salary).toLocaleString()}` : '-'}
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(emp)} className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Edit Sheet (Side Panel) */}
                    <div className={`transition-all duration-300 ease-in-out bg-white border-l border-slate-200 shadow-2xl z-20 overflow-hidden flex flex-col ${isSheetOpen ? 'w-[450px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full hidden'}`}>
                        {selectedEmp && (
                            <>
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">{selectedEmp.first_name} {selectedEmp.last_name}</h2>
                                        <p className="text-xs text-slate-500 font-mono mt-1">{selectedEmp.employee_code} • {selectedEmp.department}</p>
                                    </div>
                                    <button onClick={() => setIsSheetOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                                    {/* Earnings */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wide">
                                            <div className="h-px flex-1 bg-emerald-200"></div> Enables <div className="h-px flex-1 bg-emerald-200"></div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Basic Pay</label><input type="number" name="basic" value={formData.basic} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-emerald-500" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">HRA</label><input type="number" name="hra" value={formData.hra} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-emerald-500" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">DA</label><input type="number" name="da" value={formData.da} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-emerald-500" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Travel</label><input type="number" name="travel" value={formData.travel} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-emerald-500" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Medical</label><input type="number" name="medical" value={formData.medical} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-emerald-500" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Special</label><input type="number" name="special" value={formData.special} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-emerald-500" /></div>
                                        </div>
                                    </div>

                                    {/* Deductions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-red-700 font-bold text-sm uppercase tracking-wide">
                                            <div className="h-px flex-1 bg-red-200"></div> Deductions <div className="h-px flex-1 bg-red-200"></div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">PF (Employee)</label><input type="number" name="pf" value={formData.pf} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-red-500 bg-red-50/30" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">ESI</label><input type="number" name="esi" value={formData.esi} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-red-500 bg-red-50/30" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Prof Tax (PT)</label><input type="number" name="pt" value={formData.pt} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-red-500 bg-red-50/30" /></div>
                                            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">TDS (Tax)</label><input type="number" name="tds" value={formData.tds} onChange={handleChange} className="w-full text-right p-2 border rounded font-mono text-sm focus:ring-red-500 bg-red-50/30" /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Summary */}
                                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Gross Earnings</span>
                                        <span>₹{gross.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Total Deductions</span>
                                        <span>- ₹{deductions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200/50">
                                        <span>Net Payable</span>
                                        <span className="text-emerald-600">₹{net.toLocaleString()}</span>
                                    </div>

                                    <Button onClick={handleSave} className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white h-12 shadow-lg rounded-xl font-bold tracking-wide">
                                        <Save className="h-4 w-4 mr-2" /> Save Salary Structure
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default SalaryDetails;
