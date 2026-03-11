import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, Filter, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

import { useAuth } from '../../context/AuthContext';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' or 'grid'
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        patient_name: '',
        doctor_name: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        reason: '',
        status: 'Scheduled'
    });

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            let url = '/api/appointments?';
            if (filterStatus !== 'All') url += `status=${filterStatus}&`;
            if (filterDate) url += `date=${filterDate}&`;

            const res = await fetch(url);
            const data = await res.json();
            setAppointments(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filterStatus, filterDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setModalOpen(false);
                fetchAppointments();
                // Optionally trigger transaction creation here if paid immediately
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`/api/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchAppointments();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                        <p className="text-slate-500">Manage patient appointments and schedules.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                            <button onClick={() => setView('list')} className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>List</button>
                            {/* Grid View as Placeholder for Calendar visual */}
                            <button onClick={() => setView('grid')} className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${view === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Grid</button>
                        </div>
                        {user?.role?.toLowerCase() !== 'admin' && (
                            <Button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <Plus className="h-4 w-4 mr-2" /> New Appointment
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Search patient or doctor..." className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500/20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <input
                            type="date"
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>
                    <select
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Content */}
                {view === 'list' ? (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Patient</th>
                                            <th className="px-6 py-4">Doctor</th>
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                                        ) : appointments.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-8 text-slate-500">No appointments found.</td></tr>
                                        ) : (
                                            appointments.map(apt => (
                                                <tr key={apt.id} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{apt.patient_name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{apt.doctor_name}</td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        <div className="flex flex-col">
                                                            <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                            <span className="text-xs text-slate-400">{apt.time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                                            {apt.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {user?.role?.toLowerCase() !== 'admin' && (
                                                            <div className="flex justify-end gap-2">
                                                                <button title="Complete" onClick={() => updateStatus(apt.id, 'Completed')} className="p-1 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded">
                                                                    <CheckCircle className="h-4 w-4" />
                                                                </button>
                                                                <button title="Cancel" onClick={() => updateStatus(apt.id, 'Cancelled')} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded">
                                                                    <XCircle className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Grid/Card View */}
                        {appointments.map(apt => (
                            <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                    </div>
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                            {apt.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{apt.patient_name}</div>
                                            <div className="text-xs text-slate-500">Patient</div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-slate-50"></div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <User className="h-4 w-4" /> {apt.doctor_name}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock className="h-4 w-4" /> {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">New Appointment</h3>
                                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="h-5 w-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Patient Name</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Doctor Name</label>
                                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Date</label>
                                        <input type="date" required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Time</label>
                                        <input type="time" required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Reason</label>
                                    <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none h-20 resize-none"
                                        value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">Schedule Appointment</Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Appointments;
