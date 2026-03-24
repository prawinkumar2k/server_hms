import React, { useState } from 'react';
import { 
    Activity, ShieldCheck, Terminal, Play, 
    RefreshCcw, AlertTriangle, CheckCircle2, 
    Clock, Search, Settings, Cpu, Database, 
    Globe, BrainCircuit, Bug, Zap
} from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg ring-1 ring-slate-900/5 transition-all hover:scale-105">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} shadow-lg shadow-opacity-10`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
);

const TestDashboard = () => {
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState([
        { id: 1, name: 'Auth Module: Login', type: 'Backend', status: 'Passed', duration: '124ms', time: '2 mins ago' },
        { id: 2, name: 'Patient Registration UI', type: 'Frontend', status: 'Passed', duration: '542ms', time: '5 mins ago' },
        { id: 3, name: 'Database Query: Search Patient', type: 'Database', status: 'Failed', duration: '3.1s', time: '12 mins ago' },
        { id: 4, name: 'E2E: Full Appointment Flow', type: 'E2E', status: 'Passed', duration: '12.4s', time: '30 mins ago' },
        { id: 5, name: 'API: Health Check', type: 'Backend', status: 'Passed', duration: '45ms', time: '1 hour ago' },
    ]);

    const runTests = () => {
        setRunning(true);
        setTimeout(() => {
            setRunning(false);
            // In a real app, this would trigger an API call to run tests and refresh results
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">AI Testing Suite</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">HMS Global Testing Center</h1>
                    <p className="text-slate-500 font-medium">Monitoring system health, API integrity, and E2E stability in real-time.</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={runTests}
                        disabled={running}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-slate-950/20 active:scale-95 transition-all"
                    >
                        {running ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                        {running ? 'Executing Full Suite...' : 'Run All Tests'}
                    </button>
                    <button className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                        <Settings className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Coverage" value="94.2%" trend={1.2} icon={Zap} color="bg-indigo-600" />
                <StatCard label="Success Rate" value="99.8%" trend={0.5} icon={CheckCircle2} color="bg-emerald-500" />
                <StatCard label="Avg. Test Time" value="1.45s" trend={-2.3} icon={Clock} color="bg-blue-500" />
                <StatCard label="Active Bugs" value="4" trend={0} icon={Bug} color="bg-rose-500" />
            </div>

            {/* Main Panels */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Recent Results */}
                <div className="xl:col-span-2 bg-white/60 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden self-start">
                    <div className="p-8 border-b border-white/20 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Terminal className="h-6 w-6 text-indigo-600" />
                            Recent Execution Log
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Filter results..." 
                                className="pl-12 pr-4 py-2.5 bg-slate-100/50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Test Case</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Execution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {results.map((test) => (
                                    <tr key={test.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-900">{test.name}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                                                test.type === 'Backend' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                test.type === 'Frontend' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                test.type === 'E2E' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-slate-50 text-slate-700 border-slate-100'
                                            }`}>
                                                {test.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {test.status === 'Passed' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                                                )}
                                                <span className={`font-bold ${test.status === 'Passed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {test.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 font-mono text-sm">{test.duration}</td>
                                        <td className="px-8 py-6 text-xs font-medium text-slate-400">{test.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sub-Health Status */}
                <div className="space-y-8">
                    {/* Services Panel */}
                    <div className="bg-slate-900 rounded-[40px] shadow-2xl p-8 text-white">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Activity className="h-6 w-6 text-indigo-400" />
                            Core Services Status
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Main API Cluster', status: 'Online', icon: Cpu },
                                { name: 'DB: MySQL Connection Pool', status: 'Healthy', icon: Database },
                                { name: 'Redis Cache Layer', status: 'Connected', icon: Zap },
                                { name: 'External Lab Integration', status: 'Degraded', icon: Globe, warn: true }
                            ].map((service, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white/10 rounded-xl">
                                            <service.icon className="h-5 w-5 text-indigo-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{service.name}</div>
                                            <div className="text-xs text-white/40 font-medium tracking-wide">INSTANCE_US_E1_421</div>
                                        </div>
                                    </div>
                                    <div className={`h-2 w-2 rounded-full ${service.warn ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[40px] shadow-2xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 relative z-10">
                            <BrainCircuit className="h-6 w-6" />
                            AI-CoTester Insights
                        </h3>
                        <p className="text-indigo-100/90 text-sm leading-relaxed mb-6 relative z-10">
                            "System stability is high. Found potential race condition in 'Lab Reports' generation under high load. Recommend increasing database pool size."
                        </p>
                        <button className="w-full py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold rounded-2xl transition-all relative z-10">
                            Apply Auto-Fix
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TestDashboard;
