import React, { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal, User, FileText, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/PatientContext';

const PatientList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { patients } = usePatients();
    const [localStatusMap, setLocalStatusMap] = useState({});

    // Mock Current Doctor (Simulating Dr. K. Kumran logged in)
    const currentDoctorName = "Dr.K.Kumran";

    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [genderFilter, setGenderFilter] = useState('All');

    const filteredPatients = patients.filter(patient => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = (patient.name || "").toLowerCase().includes(lowerSearch) ||
            (patient.id || "").toString().toLowerCase().includes(lowerSearch);

        // Date Logic (Normalize to YYYY-MM-DD)
        const patientDate = (patient.date || "").split('T')[0];
        const matchesDate = !selectedDate || patientDate === selectedDate;

        // Status Filter
        const matchesStatus = statusFilter === 'All' ||
            (patient.status || 'Waiting') === statusFilter;

        // Gender Filter
        const matchesGender = genderFilter === 'All' ||
            (patient.gender || '').toLowerCase() === genderFilter.toLowerCase();

        return matchesSearch && matchesDate && matchesStatus && matchesGender;
    }).map(p => ({
        ...p,
        visitType: "Consultation", // Default as context doesn't have this
        time: "10:00 AM", // Default
        status: localStatusMap[p.id] || p.status || "Waiting"
    }));

    const handleStatusChange = (id, newStatus) => {
        setLocalStatusMap(prev => ({ ...prev, [id]: newStatus }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Waiting': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Consultations</h1>
                        <p className="text-slate-500">Manage your daily appointments and patient consultations.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
                            <span className="text-sm text-slate-500">Date:</span>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-sm border-none focus:ring-0 p-0 text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <CardTitle>Today's List</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search patients..."
                                            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        variant={showFilters ? "primary" : "ghost"}
                                        size="icon"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Expanded Filters */}
                            {showFilters && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                        <select
                                            className="w-full text-sm border-slate-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Waiting">Waiting</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                                        <select
                                            className="w-full text-sm border-slate-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                            value={genderFilter}
                                            onChange={(e) => setGenderFilter(e.target.value)}
                                        >
                                            <option value="All">All Genders</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Patient Name</th>
                                        <th className="px-6 py-4">Age/Gender</th>
                                        <th className="px-6 py-4">Visit Type</th>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient) => (
                                            <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                            {(patient.name || "?").charAt(0)}
                                                        </div>
                                                        {patient.name || "Unknown"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{patient.age} / {patient.gender}</td>
                                                <td className="px-6 py-4 text-slate-600">{patient.visitType}</td>
                                                <td className="px-6 py-4 font-mono text-slate-600">{patient.time}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patient.status)}`}>
                                                        {patient.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {patient.status === 'Waiting' && (
                                                            <Button size="sm" variant="primary" onClick={() => {
                                                                handleStatusChange(patient.id, 'In Progress');
                                                                navigate(`/doctor/notes/${patient.id}`);
                                                            }}>
                                                                Consult
                                                            </Button>
                                                        )}
                                                        {patient.status === 'In Progress' && (
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusChange(patient.id, 'Completed')}>
                                                                Finish
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/hospital/reports/patient-history?id=${patient.id}`)} title="View History">
                                                            <FileText className="h-4 w-4 text-slate-500" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                    <p>No patients found matching your search.</p>
                                                    {selectedDate && <p className="text-xs text-slate-400">Checking date: {selectedDate}</p>}
                                                </div>
                                            </td>
                                        </tr>
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

export default PatientList;
