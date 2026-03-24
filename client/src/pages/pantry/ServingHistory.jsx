import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Utensils, Clock, CheckCircle, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API from '../../config';

const ServingHistory = () => {
    const { user } = useAuth();
    const isViewOnly = user?.role === 'Admin';
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Default to last 7 days
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(sevenDaysAgo);
    const [endDate, setEndDate] = useState(today);

    useEffect(() => { fetchHistory(); }, [startDate, endDate]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/pantry/history`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: { startDate, endDate }
            });
            setHistory(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const exportToCSV = () => {
        if (history.length === 0) return alert('No data to export');
        const headers = "Patient Name,Ward,Bed,Diet Type,Meal Time,Served At,Served By\n";
        const rows = history.map(h => `"${h.patient_name}","${h.ward}","${h.bed_number}","${h.diet_type}","${h.meal_time}","${new Date(h.delivered_at).toLocaleString()}","${h.delivered_by_name || 'System'}"`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pantry_serving_history_${startDate}_to_${endDate}.csv`;
        a.click();
    };

    const filteredHistory = history.filter(item =>
        item.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diet_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ward?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const mealColors = {
        Breakfast: 'bg-orange-50 text-orange-700',
        Lunch: 'bg-yellow-50 text-yellow-700',
        Snack: 'bg-pink-50 text-pink-700',
        Dinner: 'bg-indigo-50 text-indigo-700'
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <History className="h-6 w-6 text-indigo-500" /> Serving History
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Audit log of all delivered dietary meals</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-3 border-r border-slate-200">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm border-none bg-transparent focus:ring-0 text-slate-700" />
                        <span className="text-slate-400 text-sm">to</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm border-none bg-transparent focus:ring-0 text-slate-700" />
                    </div>

                    <div className="relative border-r border-slate-200 pr-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Search patient, ward..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm border-none bg-transparent" />
                    </div>

                    <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Patient & Location</th>
                                    <th className="px-6 py-4">Diet Details</th>
                                    <th className="px-6 py-4">Meal Time</th>
                                    <th className="px-6 py-4">Served At</th>
                                    <th className="px-6 py-4">Served By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{item.patient_name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{item.ward} • Bed {item.bed_number}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-800">{item.diet_type}</p>
                                            {item.special_instructions && <p className="text-xs text-slate-400 max-w-[200px] truncate mt-0.5">{item.special_instructions}</p>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${mealColors[item.meal_time] || 'bg-slate-100 text-slate-700'}`}>
                                                {item.meal_time}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 tabular-nums text-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                <span>{new Date(item.delivered_at).toLocaleDateString()}</span>
                                                <span className="text-xs text-slate-400 ml-1">{new Date(item.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {item.delivered_by_name || 'System / Auto'}
                                        </td>
                                    </tr>
                                ))}
                                {filteredHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            <Utensils className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                                            <p>No serving history found for this period.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServingHistory;
