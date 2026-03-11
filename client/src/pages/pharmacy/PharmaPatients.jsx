import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Save, X, UserCircle, Phone, MapPin, Stethoscope, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import DataTable from '../../components/common/DataTable';
import Autocomplete from '../../components/common/Autocomplete';

const PharmaPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        id: '', name: '', age: '', gender: 'Male', doctor: '', refDoctor: '', address: '', phone: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await fetch('/api/patients');
            const data = await res.json();
            setPatients(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchDoctors = async (searchQuery) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/doctors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }

            const doctors = await response.json();

            // Filter doctors by search query
            return doctors.filter(doctor =>
                doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(doctor => ({
                name: doctor.full_name,
                specialization: doctor.specialization,
                department: doctor.department
            }));
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return [];
        }
    };

    const handleDoctorSelect = (selectedDoctor) => {
        setFormData({ ...formData, doctor: selectedDoctor.name });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchPatients();
                setIsFormOpen(false);
                setFormData({
                    id: '', name: '', age: '', gender: 'Male', doctor: '', refDoctor: '', address: '', phone: ''
                });
            } else {
                alert('Failed to register patient');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header Section - Violet Theme */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary-50 rounded-lg">
                                <Users className="h-6 w-6 text-primary-600" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pharma Patient Directory</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Register patient demographics for pharmacy billing.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className={`${isFormOpen ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200'} transition-all`}
                        >
                            {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isFormOpen ? 'Cancel Entry' : 'New Patient'}
                        </Button>
                    </div>
                </div>

                {/* Collapsible Form */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Card className="border-primary-100 shadow-xl bg-white relative overflow-hidden">

                        <CardHeader className="pb-6 border-b border-primary-50 relative z-10">
                            <CardTitle className="text-lg text-primary-900 flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-primary-600" />
                                Patient Registration
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Row 1 */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Patient ID</label>
                                    <input
                                        name="cusId"
                                        value={formData.cusId}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50 font-mono"
                                        placeholder="Auto-Generated"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full h-11 pl-10 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm"
                                            placeholder="Patient Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mobile No</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full h-11 pl-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm"
                                            placeholder="Mobile Number"
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Age</label>
                                    <input
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm"
                                        placeholder="Yrs"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white shadow-sm"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Referring Doctor</label>
                                    <Autocomplete
                                        name="doctor"
                                        value={formData.doctor}
                                        onChange={(value) => setFormData({ ...formData, doctor: value })}
                                        onSelect={handleDoctorSelect}
                                        placeholder="Doctor Name"
                                        icon={Stethoscope}
                                        fetchSuggestions={fetchDoctors}
                                        className="w-full h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm"
                                    />
                                </div>

                                {/* Row 3 */}
                                <div className="space-y-1.5 md:col-span-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full h-11 pl-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm"
                                            placeholder="Full Address"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 h-11 px-8 rounded-xl">
                                    <Save className="h-4 w-4 mr-2" /> Register Patient
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Grid - Native Table */}
                <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Patient Name</th>
                                        <th className="px-6 py-4">Age / Sex</th>
                                        <th className="px-6 py-4">Doctor</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading Patients...</td></tr>
                                    ) : patients.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">No patients registered.</td></tr>
                                    ) : (
                                        patients.filter(p =>
                                            (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                            (p.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                        ).map((patient, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-xs text-slate-500">{patient.id}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                            {(patient.name || '?').charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{patient.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-600">
                                                    {patient.age} <span className="text-slate-400 text-xs">Yrs</span> / {patient.gender}
                                                </td>
                                                <td className="px-6 py-3 text-slate-600 font-medium">{patient.doctor || '-'}</td>
                                                <td className="px-6 py-3 font-mono text-slate-500 text-xs">{patient.phone || '-'}</td>
                                                <td className="px-6 py-3 text-slate-500 text-xs max-w-[200px] truncate" title={patient.address}>{patient.address || '-'}</td>
                                                <td className="px-6 py-3 text-center">
                                                    <button className="text-violet-600 hover:text-violet-800 font-medium text-xs">Edit</button>
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
export default PharmaPatients;
