import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import {
    Activity, AlertCircle, ArrowRight, BedDouble, Calendar, ChevronDown,
    Filter, Layout, MoreHorizontal, Search, User
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const Encounters = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/ipd/encounters');
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Failed to load encounters data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const metrics = [
        { title: 'Readmission Rate', value: data?.metrics?.readmissionRate + '%', trend: '-2.5%', color: 'text-rose-600', bg: 'bg-rose-50' },
        { title: 'Avg Length of Stay', value: data?.metrics?.avgLOS + ' Days', trend: '-1.5%', color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Infection Rate', value: data?.metrics?.infectionRate + '%', trend: '+0.4%', color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Mortality Rate', value: data?.metrics?.mortalityRate + '%', trend: '0.0%', color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Encounters & Risk Monitoring</h1>
                        <p className="text-slate-500">Real-time analysis of inpatient encounters and predicted risks.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2"><Layout className="h-4 w-4" /> Customize</Button>
                        <Button variant="outline" className="gap-2"><ArrowRight className="h-4 w-4" /> Export</Button>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((m, i) => (
                        <Card key={i} className="border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-3 opacity-10 ${m.color}`}>
                                <Activity className="h-12 w-12" />
                            </div>
                            <CardContent className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{m.title}</p>
                                <div className="flex items-end gap-2 mb-2">
                                    <h3 className="text-2xl font-bold text-slate-900">{m.value}</h3>
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${m.bg} ${m.color}`}>
                                        {m.trend}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400">vs last 30 days</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Last 30 Days</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <span>Conditions: All</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                        <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span>Risk: High Only</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </div>
                    {/* Placeholder Filters */}
                    {['Status', 'Provider', 'Location', 'Clinical Program'].map(f => (
                        <div key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                            {f}
                        </div>
                    ))}
                </div>

                {/* Data Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">Patient</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Encounter</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Provider</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">LOS (Days)</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Readmission Risk</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data?.encounters?.map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                    {row.patient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{row.patient.name}</div>
                                                    <div className="text-xs text-slate-500 font-mono">ID: {row.patient.id || '---'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${row.status === 'Admitted'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-slate-700">{row.encounter.reason}</div>
                                            <div className="text-xs text-slate-400">{new Date(row.encounter.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-600 font-medium">Dr. {row.provider.name}</div>
                                            <div className="text-xs text-slate-400">{row.provider.specialty}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-mono">
                                            {row.location}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{row.metrics.los} Days</span>
                                                <span className="text-xs text-slate-400">Pred: {row.metrics.predictedLos} Days</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* Risk Viz */}
                                            <div className="flex flex-col items-center">
                                                <div className={`text-xs font-bold ${row.metrics.readmissionRisk === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    {row.metrics.riskScore}
                                                </div>
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${row.metrics.readmissionRisk === 'High' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min(parseFloat(row.metrics.riskScore) * 20, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-0.5">{row.metrics.infection} Inf. Risk</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination - Visual Only */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
                        <div>Showing {data?.encounters?.length} of {data?.encounters?.length * 3} patients</div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" disabled>Previous</Button>
                            <Button size="sm" variant="outline">Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Encounters;
