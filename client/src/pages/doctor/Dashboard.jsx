import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, Clock, Users, Activity,
    Search, Bell, ChevronRight, FileText, CheckCircle,
    AlertCircle, MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/PatientContext';

const DoctorDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { patients, loading } = usePatients();

    // Filter today's appointments
    const allAppointments = patients.filter(p => !p.status || p.status !== 'Completed');

    // Apply Search
    const appointments = allAppointments.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id?.toString().includes(searchQuery)
    );

    const [selectedPatientId, setSelectedPatientId] = useState(null);

    // Select first patient by default
    useEffect(() => {
        if (appointments.length > 0 && !selectedPatientId) {
            // Prefer "In Progress" or first "Waiting"
            const active = appointments.find(p => p.status === 'In Progress') || appointments[0];
            setSelectedPatientId(active.id);
        }
    }, [appointments, selectedPatientId]);

    const selectedPatient = appointments.find(p => p.id === selectedPatientId);

    // Dynamic Stats Calculation
    const totalPatients = patients.length;
    const completedCount = patients.filter(p => p.status === 'Completed').length;
    const waitingCount = patients.filter(p => p.status === 'Waiting').length;
    // Calculate Workload (Mock logic: 70% base + 2% per patient)
    const workload = Math.min(100, 70 + (waitingCount * 2));

    const stats = [
        { label: "Pending Patients", value: waitingCount, change: "Active Queue", icon: Users, color: "text-blue-600 bg-blue-50" },
        { label: "Completed", value: completedCount, change: "Today", icon: CheckCircle, color: "text-purple-600 bg-purple-50" },
        { label: "Load", value: `${workload}%`, change: workload > 90 ? "High" : "Normal", icon: Activity, color: "text-amber-600 bg-amber-50" },
    ];

    if (loading) return <div className="p-10 flex justify-center text-slate-500">Loading Dashboard...</div>;

    return (
        <PageTransition>
            {/* Main Container - Fixed Height, No Scroll on Main Body */}
            <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col overflow-hidden">

                {/* Header Section */}
                <div className="flex-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Dashboard</h1>
                        <p className="text-slate-500">Welcome Dr. Smith, you have <span className="font-bold text-slate-900">{waitingCount}</span> patients waiting.</p>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="relative text-slate-500">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid - Takes remaining height */}
                <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 pb-2">

                    {/* Left Column: Timeline & Stats - Scrollable */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                        {/* Calendar / Timeline Widget */}
                        <Card className="border-none shadow-md flex-none">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-900">Today's Timeline</h3>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                    <div className="relative pl-8">
                                        <div className="absolute left-3.5 top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white ring-1 ring-slate-300"></div>
                                        <p className="text-xs font-bold text-slate-400">09:00</p>
                                        <p className="text-sm font-medium text-slate-900">Team Briefing</p>
                                        <p className="text-xs text-slate-500">Conference Room A</p>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute left-3.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white ring-1 ring-primary-500 shadow-sm shadow-primary-200"></div>
                                        <p className="text-xs font-bold text-slate-400">10:00 - 13:00</p>
                                        <p className="text-sm font-bold text-primary-700">Outpatient Consultations</p>
                                        <p className="text-xs text-slate-500">Cabin 204</p>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute left-3.5 top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white ring-1 ring-slate-300"></div>
                                        <p className="text-xs font-bold text-slate-400">14:00</p>
                                        <p className="text-sm font-medium text-slate-900">Lab Review</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Widgets */}
                        {stats.map((stat, i) => (
                            <Card key={i} className="border-none shadow-sm flex-none">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase">{stat.label}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                            <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-bold">{stat.change}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Middle Column: Doctor's Queue (Master View) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col">
                        <Card className="h-[600px] border-none shadow-md flex flex-col overflow-hidden transition-all duration-300">
                            <div className="flex-none p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-900">Appointments</h3>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{appointments.length}</span>
                                </div>
                                <CalendarIcon className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                {appointments.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400">No active appointments</div>
                                ) : (
                                    appointments.map((apt, index) => {
                                        const isSelected = selectedPatientId === apt.id;
                                        // Fake time generation based on index
                                        const time = `10:${(index * 15).toString().padStart(2, '0')}`;

                                        return (
                                            <div
                                                key={apt.id}
                                                onClick={() => setSelectedPatientId(apt.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected
                                                    ? 'bg-primary-50 border-primary-200 shadow-sm ring-1 ring-primary-100'
                                                    : 'bg-white border-transparent hover:bg-slate-50 border-slate-100'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-white text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {time} AM
                                                    </span>
                                                    {apt.status === 'Completed' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-primary-200 text-primary-800' : 'bg-slate-100 text-slate-500'}`}>
                                                        {(apt.name || "?").charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-bold text-sm ${isSelected ? 'text-primary-900' : 'text-slate-900'}`}>{apt.name}</h4>
                                                        <p className={`text-xs ${isSelected ? 'text-primary-600' : 'text-slate-500'}`}>General Checkup</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Active Patient Detail (5 cols) */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col h-full">
                        {selectedPatient ? (
                            <Card className="h-full border-none shadow-lg flex flex-col relative overflow-hidden">
                                {/* Decorator Background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>

                                <div className="p-6 relative z-10 flex-1 flex flex-col">
                                    {/* Patient Header */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-4">
                                            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl font-bold text-slate-800">
                                                {(selectedPatient.name || "?").charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                                                <p className="text-sm text-slate-500">#{selectedPatient.id} • {selectedPatient.gender}, {selectedPatient.age} yrs</p>
                                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                                                    New Appt
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                        </Button>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Referral</p>
                                            <p className="text-sm font-medium text-slate-700">{selectedPatient.refDoctorName || "Direct Walk-in"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Last Visit</p>
                                            <p className="text-sm font-medium text-slate-700">20 Oct 2023</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Symptoms</p>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                                                Patient reports severe itching and rash on the face. Suspected food allergy.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions spacer */}
                                    <div className="flex-1"></div>

                                    {/* Primary Action Button */}
                                    <Button
                                        onClick={() => navigate(`/doctor/notes/${selectedPatient.id}`)}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 py-4 h-auto rounded-xl flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-1"
                                    >
                                        <span>Open Medical Card</span>
                                        <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Button>

                                    {/* Secondary Status Badges */}
                                    <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold whitespace-nowrap border border-indigo-100">
                                            <Activity className="h-3 w-3" /> Basic Vitals Check
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold whitespace-nowrap border border-orange-100">
                                            <AlertCircle className="h-3 w-3" /> Allergy Alert
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 m-4">
                                <Users className="h-12 w-12 mb-2 opacity-50" />
                                <p>Select a patient to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default DoctorDashboard;
