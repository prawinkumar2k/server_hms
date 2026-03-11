import React from 'react';

const DashboardStack = () => {
    return (
        <div className="relative w-full max-w-[900px] h-[600px] mx-auto perspective-1000 group">
            {/* Base Glow */}
            <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-3xl transform translate-y-20 group-hover:bg-indigo-500/20 transition-all duration-700"></div>

            {/* 5. Admin (Back - Furthest) */}
            <div className="absolute inset-x-24 top-0 h-[480px] transform scale-85 -translate-y-24 translate-z-0 transition-all duration-700 ease-out group-hover:translate-x-[200px] group-hover:translate-y-8 group-hover:rotate-6 z-0 border border-slate-200/50 bg-white rounded-xl shadow-xl overflow-hidden opacity-40 group-hover:opacity-100">
                <img src="/assets/images/dashboard-admin.png" alt="Admin Dashboard" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* 4. Lab */}
            <div className="absolute inset-x-20 top-4 h-[480px] transform scale-90 -translate-y-18 translate-z-10 transition-all duration-700 ease-out group-hover:translate-x-[100px] group-hover:translate-y-6 group-hover:rotate-3 z-10 border border-slate-200/50 bg-white rounded-xl shadow-xl overflow-hidden opacity-60 group-hover:opacity-100">
                <img src="/assets/images/dashboard-lab.png" alt="Lab Dashboard" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-black/5"></div>
            </div>

            {/* 3. Pharmacy */}
            <div className="absolute inset-x-16 top-8 h-[480px] transform scale-95 -translate-y-12 translate-z-20 transition-all duration-700 ease-out group-hover:-translate-x-[100px] group-hover:translate-y-4 group-hover:-rotate-3 z-20 border border-slate-200/50 bg-white rounded-xl shadow-xl overflow-hidden opacity-80 group-hover:opacity-100">
                <img src="/assets/images/dashboard-pharma.png" alt="Pharmacy Dashboard" className="w-full h-full object-cover object-top" />
            </div>

            {/* 2. Doctor */}
            <div className="absolute inset-x-12 top-12 h-[480px] transform scale-100 -translate-y-6 translate-z-30 transition-all duration-700 ease-out group-hover:-translate-x-[200px] group-hover:translate-y-2 group-hover:-rotate-6 z-30 border border-slate-200 bg-white rounded-xl shadow-2xl overflow-hidden opacity-90 group-hover:opacity-100">
                <img src="/assets/images/dashboard-doctor.png" alt="Doctor Dashboard" className="w-full h-full object-cover object-top" />
            </div>

            {/* 1. Reception (Front) */}
            <div className="absolute inset-x-8 top-16 h-[480px] transform scale-105 translate-y-0 translate-z-40 transition-all duration-700 ease-out group-hover:translate-y-6 group-hover:scale-110 z-40 border border-slate-200 bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                {/* Browser Mockup Header */}
                <div className="absolute top-0 w-full h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2 z-50">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                    <div className="ml-4 h-4 w-60 bg-slate-200/50 rounded-full flex items-center px-2">
                        <span className="text-[8px] text-slate-400">hms.local/hospital/reception</span>
                    </div>
                </div>
                <div className="pt-8 h-full bg-slate-50">
                    <img src="/assets/images/dashboard-reception.png" alt="Reception Dashboard" className="w-full h-full object-cover object-top" />
                </div>
            </div>

            {/* Interactive Badge */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 group-hover:translate-x-4 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-slate-800 text-sm">Real-Time Sync</span>
                </div>
                <div className="text-xs text-slate-500">
                    5 Active Modules
                </div>
            </div>
        </div>
    );
};

export default DashboardStack;
