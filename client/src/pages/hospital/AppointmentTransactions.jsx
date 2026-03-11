import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, X, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';

const AppointmentTransactions = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Date filter state
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activePreset, setActivePreset] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/billing', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setInvoices(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Quick date preset helpers
    const applyPreset = (preset) => {
        const today = new Date();
        let start = '';
        let end = today.toISOString().split('T')[0];

        if (preset === activePreset) {
            // Toggle off
            setFromDate('');
            setToDate('');
            setActivePreset('');
            return;
        }

        switch (preset) {
            case 'today':
                start = end;
                break;
            case 'week': {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                start = weekStart.toISOString().split('T')[0];
                break;
            }
            case 'month': {
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                start = monthStart.toISOString().split('T')[0];
                break;
            }
            default:
                break;
        }

        setFromDate(start);
        setToDate(end);
        setActivePreset(preset);
    };

    const clearFilters = () => {
        setFromDate('');
        setToDate('');
        setSearchTerm('');
        setActivePreset('');
    };

    const hasActiveFilters = fromDate || toDate || searchTerm;

    // Filtered + sorted invoices
    const filteredInvoices = useMemo(() => {
        let result = invoices.filter(inv => {
            // Text search
            const matchesSearch =
                !searchTerm ||
                inv.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.id?.toString().includes(searchTerm) ||
                inv.total_amount?.toString().includes(searchTerm);

            // Date range filter
            const invDate = new Date(inv.invoice_date || inv.created_at);
            invDate.setHours(0, 0, 0, 0);

            let matchesDate = true;
            if (fromDate) {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && invDate >= from;
            }
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && invDate <= to;
            }

            return matchesSearch && matchesDate;
        });

        // Sort by date
        result.sort((a, b) => {
            const dateA = new Date(a.invoice_date || a.created_at);
            const dateB = new Date(b.invoice_date || b.created_at);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [invoices, searchTerm, fromDate, toDate, sortOrder]);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
                        <p className="text-slate-500">Manage patient invoices and billing records.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex flex-col gap-4">
                            {/* Row 1: Search + Quick Presets */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search invoice..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Quick:</span>
                                    {[
                                        { key: 'today', label: 'Today' },
                                        { key: 'week', label: 'This Week' },
                                        { key: 'month', label: 'This Month' },
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => applyPreset(key)}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${activePreset === key
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Row 2: Date Range Pickers + Sort + Clear */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-500 font-medium">Date Range:</span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => {
                                                setFromDate(e.target.value);
                                                setActivePreset('');
                                            }}
                                            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            placeholder="From"
                                        />
                                    </div>

                                    <span className="text-slate-400 text-sm">to</span>

                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => {
                                                setToDate(e.target.value);
                                                setActivePreset('');
                                            }}
                                            min={fromDate}
                                            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            placeholder="To"
                                        />
                                    </div>

                                    {/* Sort toggle */}
                                    <button
                                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                        className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center gap-1"
                                        title={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
                                    >
                                        {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
                                    </button>

                                    {/* Clear filters */}
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-3 py-2 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-1"
                                        >
                                            <X className="h-3 w-3" />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Active filter summary */}
                            {hasActiveFilters && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/50 rounded-lg px-3 py-2 border border-blue-100">
                                    <Filter className="h-3 w-3 text-blue-500" />
                                    <span>
                                        Showing <strong className="text-slate-700">{filteredInvoices.length}</strong> of{' '}
                                        <strong className="text-slate-700">{invoices.length}</strong> invoices
                                        {fromDate && <span> from <strong className="text-slate-700">{new Date(fromDate).toLocaleDateString()}</strong></span>}
                                        {toDate && <span> to <strong className="text-slate-700">{new Date(toDate).toLocaleDateString()}</strong></span>}
                                        {searchTerm && <span> matching "<strong className="text-slate-700">{searchTerm}</strong>"</span>}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Invoice #</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th
                                            className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors select-none"
                                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                        >
                                            Date {sortOrder === 'desc' ? '↓' : '↑'}
                                        </th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                                    ) : filteredInvoices.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-8 text-slate-500">No invoices found for the selected date range.</td></tr>
                                    ) : (
                                        filteredInvoices.map((inv, idx) => (
                                            <tr key={inv.id || idx} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4 text-slate-500 font-mono">#{inv.id}</td>
                                                <td className="px-6 py-4 font-medium text-slate-900">{inv.patient_name}</td>
                                                <td className="px-6 py-4 text-slate-600">{inv.category || 'General'}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900">₹{inv.total_amount}</td>
                                                <td className="px-6 py-4 text-slate-600">{new Date(inv.invoice_date || inv.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        inv.status === 'Partial' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-slate-50 text-slate-600 border-slate-100'
                                                        }`}>
                                                        {inv.status || 'Pending'}
                                                    </span>
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

export default AppointmentTransactions;
