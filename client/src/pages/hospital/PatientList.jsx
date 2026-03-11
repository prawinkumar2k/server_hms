import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 15;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                if (res.ok) {
                    const data = await res.json();
                    setPatients(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error('Failed to fetch patients:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Filter patients
    const filtered = patients.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.mobile || '').includes(searchTerm) ||
        (p.id || '').toString().includes(searchTerm)
    );

    // Pagination
    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    // Reset to page 1 on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient List</h1>
                        <p className="text-slate-500">View and search all registered patients.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg border border-primary-100">
                            {filtered.length} Patients
                        </span>
                    </div>
                </div>

                {/* Search & Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, mobile, or patient ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Table */}
                <Card>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-12 text-center text-slate-400 text-sm">Loading patients...</div>
                        ) : paginated.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                {searchTerm ? 'No patients match your search.' : 'No patients registered yet.'}
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Patient Name</th>
                                        <th className="px-4 py-3">Mobile</th>
                                        <th className="px-4 py-3">Age / Gender</th>
                                        <th className="px-4 py-3">Blood Group</th>
                                        <th className="px-4 py-3">Doctor</th>
                                        <th className="px-4 py-3">Address</th>
                                        <th className="px-4 py-3">OP Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginated.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900">{patient.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {patient.photo ? (
                                                        <img
                                                            src={`/api/patients/${patient.id}/photo?t=${patient.photo}`}
                                                            alt={patient.name}
                                                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
                                                            <User className="w-3.5 h-3.5 text-primary-500" />
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-primary-700">{patient.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {patient.mobile ? (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3 text-slate-400" />
                                                        {patient.mobile}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{patient.age || '—'} / {patient.gender || '—'}</td>
                                            <td className="px-4 py-3">
                                                {patient.bloodGroup ? (
                                                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded border border-red-100">
                                                        {patient.bloodGroup}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{patient.doctor || '—'}</td>
                                            <td className="px-4 py-3 text-slate-500 text-xs max-w-[150px] truncate">{patient.address || '—'}</td>
                                            <td className="px-4 py-3 font-medium text-emerald-600">₹ {patient.opFee || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                            <p className="text-xs text-slate-500">
                                Showing {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    } else if (currentPage <= 3) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    } else {
                                        page = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 text-xs font-medium rounded-md transition-colors ${currentPage === page
                                                    ? 'bg-primary-600 text-white'
                                                    : 'hover:bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </PageTransition>
    );
};

export default PatientList;
