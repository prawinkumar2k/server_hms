import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Building, CreditCard, Save, X, FileText, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const EmployeeMaster = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('personal'); // personal, professional, financial

    const initialFormState = {
        firstName: '', lastName: '', email: '', phone: '', dob: '', gender: 'Male', bloodGroup: '', address: '',
        department: '', designation: '', dateOfJoining: '', employmentType: 'Permanent', status: 'Active',
        bankName: '', accountNumber: '', ifscCode: '', panNumber: '', aadhaarNumber: '', uanNumber: '', esicNumber: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/payroll/employees', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setEmployees(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) { console.error(error); setLoading(false); }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const url = formData.id ? `/api/payroll/employees/${formData.id}` : '/api/payroll/employees';
            const method = formData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchEmployees();
                setIsFormOpen(false);
                setFormData(initialFormState);
                setActiveTab('personal');
            } else {
                alert('Failed to save employee');
            }
        } catch (error) { console.error(error); }
    };

    const handleEdit = (emp) => {
        setFormData(emp);
        setIsFormOpen(true);
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-indigo-100/50 rounded-lg">
                                <User className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tight">Employee Master</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Manage staff details, employment contracts, and statutory info.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => { setIsFormOpen(!isFormOpen); setFormData(initialFormState); }}
                            className={`${isFormOpen ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'} transition-all`}
                        >
                            {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isFormOpen ? 'Cancel Entry' : 'Add Employee'}
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Card className="border-indigo-100 shadow-xl bg-white relative overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            {[
                                { id: 'personal', label: 'Personal Info', icon: User },
                                { id: 'professional', label: 'Employment Details', icon: Building },
                                { id: 'financial', label: 'Bank & Statutory', icon: CreditCard }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <tab.icon className="h-4 w-4" /> {tab.label}
                                </button>
                            ))}
                        </div>
                        <CardContent className="pt-6">
                            {activeTab === 'personal' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">First Name</label><input name="firstName" value={formData.firstName} onChange={handleInputChange} className="input w-full" placeholder="John" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Last Name</label><input name="lastName" value={formData.lastName} onChange={handleInputChange} className="input w-full" placeholder="Doe" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input name="email" value={formData.email} onChange={handleInputChange} className="input w-full" placeholder="john@example.com" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input name="phone" value={formData.phone} onChange={handleInputChange} className="input w-full" placeholder="9876543210" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">DOB</label><input type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={handleInputChange} className="input w-full" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="input w-full">
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Blood Group</label>
                                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="input w-full">
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Address</label><input name="address" value={formData.address} onChange={handleInputChange} className="input w-full" placeholder="Full residential address" /></div>
                                </div>
                            )}

                            {activeTab === 'professional' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                                        <select name="department" value={formData.department} onChange={handleInputChange} className="input w-full">
                                            <option value="">Select Department</option>
                                            <option value="Administration">Administration</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="ENT">ENT</option>
                                            <option value="General Medicine">General Medicine</option>
                                            <option value="Gynaecology">Gynaecology</option>
                                            <option value="ICU">ICU</option>
                                            <option value="Laboratory">Laboratory</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Nursing">Nursing</option>
                                            <option value="Oncology">Oncology</option>
                                            <option value="Ophthalmology">Ophthalmology</option>
                                            <option value="Orthopaedics">Orthopaedics</option>
                                            <option value="Paediatrics">Paediatrics</option>
                                            <option value="Pathology">Pathology</option>
                                            <option value="Pharmacy">Pharmacy</option>
                                            <option value="Physiotherapy">Physiotherapy</option>
                                            <option value="Radiology">Radiology</option>
                                            <option value="Surgery">Surgery</option>
                                            <option value="Urology">Urology</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Designation</label>
                                        <select name="designation" value={formData.designation} onChange={handleInputChange} className="input w-full">
                                            <option value="">Select Designation</option>
                                            <option value="Medical Director">Medical Director</option>
                                            <option value="Senior Consultant">Senior Consultant</option>
                                            <option value="Consultant">Consultant</option>
                                            <option value="Junior Doctor">Junior Doctor</option>
                                            <option value="Resident Doctor">Resident Doctor</option>
                                            <option value="Head Nurse">Head Nurse</option>
                                            <option value="Senior Nurse">Senior Nurse</option>
                                            <option value="Staff Nurse">Staff Nurse</option>
                                            <option value="Nursing Assistant">Nursing Assistant</option>
                                            <option value="Lab Technician">Lab Technician</option>
                                            <option value="Radiologist">Radiologist</option>
                                            <option value="Pharmacist">Pharmacist</option>
                                            <option value="Physiotherapist">Physiotherapist</option>
                                            <option value="Receptionist">Receptionist</option>
                                            <option value="Admin Executive">Admin Executive</option>
                                            <option value="HR Manager">HR Manager</option>
                                            <option value="Accountant">Accountant</option>
                                            <option value="Security">Security</option>
                                            <option value="Housekeeping">Housekeeping</option>
                                            <option value="Driver">Driver</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Date of Joining</label><input type="date" name="dateOfJoining" value={formData.dateOfJoining ? formData.dateOfJoining.split('T')[0] : ''} onChange={handleInputChange} className="input w-full" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Employment Type</label>
                                        <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} className="input w-full">
                                            <option>Permanent</option><option>Probation</option><option>Contract</option><option>Visiting</option><option>Intern</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="input w-full">
                                            <option>Active</option><option>Resigned</option><option>Terminated</option><option>On Leave</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'financial' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Bank Name</label><input name="bankName" value={formData.bankName} onChange={handleInputChange} className="input w-full" placeholder="HDFC Bank" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Account Number</label><input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="input w-full" placeholder="0000000000" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">IFSC Code</label><input name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="input w-full" placeholder="HDFC0001234" /></div>
                                    <div className="col-span-3 border-t border-slate-100 my-2"></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">PAN Number</label><input name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="input w-full" placeholder="ABCDE1234F" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Aadhaar Number</label><input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} className="input w-full" placeholder="0000 0000 0000" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">UAN (PF)</label><input name="uanNumber" value={formData.uanNumber} onChange={handleInputChange} className="input w-full" placeholder="100000000000" /></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">ESIC Number</label><input name="esicNumber" value={formData.esicNumber} onChange={handleInputChange} className="input w-full" placeholder="0000000000" /></div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 h-11 px-8 rounded-xl">
                                    <Save className="h-4 w-4 mr-2" /> Save Employee
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Emp Code</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Designation</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading Staff Data...</td></tr>
                                    ) : employees.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">No employees found.</td></tr>
                                    ) : (
                                        employees.filter(e =>
                                            (e.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (e.employee_code?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                        ).map((emp, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => handleEdit(emp)}>
                                                <td className="px-6 py-3 font-mono text-xs text-slate-500">{emp.employee_code}</td>
                                                <td className="px-6 py-3 font-bold text-slate-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                                                            {emp.first_name[0]}{emp.last_name[0]}
                                                        </div>
                                                        {emp.first_name} {emp.last_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-600">{emp.designation}</td>
                                                <td className="px-6 py-3 text-slate-600">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                                        {emp.department}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-slate-500 text-xs">{emp.employment_type}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                        {emp.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
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

export default EmployeeMaster;
