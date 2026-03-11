import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, Stethoscope, Clock, AlertCircle } from 'lucide-react';

const DoctorStatus = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/doctors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Inactive': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'On Leave': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading doctor status...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-indigo-600" />
                        Doctor Status
                    </h1>
                    <p className="text-slate-500 mt-1">Real-time availability of hospital staff.</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search doctor or department..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Doctor Name</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Specialization</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                            <tr key={doctor.id}
                                onClick={() => navigate(`/reception/doctors/${doctor.id}`)}
                                className="hover:bg-indigo-50/50 transition-colors cursor-pointer group"
                            >
                                <td className="p-4">
                                    <div className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                        Dr. {doctor.full_name}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">{doctor.department || '-'}</td>
                                <td className="p-4 text-slate-500 text-sm">{doctor.specialization || '-'}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(doctor.availability_status)}`}>
                                        {doctor.availability_status || 'Unknown'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        View Profile &rarr;
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                                    <AlertCircle className="w-8 h-8 opacity-50" />
                                    No doctors found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Legend / Status Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-800">Active: Available for consults</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-amber-800">On Leave: Not currently available</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Inactive: No longer with hospital</span>
                </div>
            </div>
        </div>
    );
};

export default DoctorStatus;
