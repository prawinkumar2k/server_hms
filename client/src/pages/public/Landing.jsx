import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, ShieldCheck, Stethoscope, Building2,
    CreditCard, Users, ArrowRight, Database,
    CheckCircle2, BarChart3, Clock, Lock, FileText,
    Menu, X, HeartPulse, Microscope, Pill,
    UserCircle, CalendarCheck, Phone, Mail, MapPin,
    LayoutGrid, ChevronRight, Laptop, Server, Zap
} from 'lucide-react';
import { Button } from '../../components/common/Button';

const ScrollReveal = ({ children, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
        >
            {children}
        </div>
    );
};

const CountUpStat = ({ label, value, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const target = parseInt(value.replace(/[^0-9]/g, "")) || 0;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
    }, [target]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
                {count}{value.includes('M') ? 'M+' : value.includes('%') ? '%' : '+'}
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
        </div>
    );
};

const RoleLoginSection = () => {
    const navigate = useNavigate();

    const roles = [
        { id: 'Admin', label: 'Administrator', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', hoverBorder: 'hover:border-purple-200' },
        { id: 'Doctor', label: 'Doctor', icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50', hoverBorder: 'hover:border-blue-200' },
        { id: 'Receptionist', label: 'Receptionist', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', hoverBorder: 'hover:border-indigo-200' },
        { id: 'Pharmacist', label: 'Pharmacist', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50', hoverBorder: 'hover:border-emerald-200' },
        { id: 'Lab Technician', label: 'Lab Technician', icon: Microscope, color: 'text-orange-600', bg: 'bg-orange-50', hoverBorder: 'hover:border-orange-200' },
        { id: 'HR', label: 'Human Resources', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', hoverBorder: 'hover:border-rose-200' },
    ];

    return (
        <section id="login" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Portal Access</h2>
                    <h3 className="text-3xl font-bold text-slate-900">Select Your Role to Login</h3>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                        Secure access for authorized personnel only. Please select your department to proceed to the authentication gateway.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => navigate('/login', { state: { role: role.id } })}
                            className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${role.hoverBorder} group`}
                        >
                            <div className={`h-12 w-12 ${role.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <role.icon className={`h-6 w-6 ${role.color}`} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{role.label}</h4>
                            <span className="text-xs text-slate-400 font-medium group-hover:text-indigo-600 flex items-center gap-1">
                                Login <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Mockup of the Dashboard for the Hero Section
const HospitalDashboardVisual = () => {
    return (
        <div className="relative w-full max-w-5xl mx-auto perspective-1000">
            {/* Main Window Frame */}
            <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 transform rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out z-10 relative left-0 right-0 mx-auto">
                {/* Header */}
                <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-slate-900 text-slate-400 px-3 py-1 rounded text-xs flex-1 text-center font-mono">
                        hms.pro/hospital/dashboard
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-slate-50 p-6 grid grid-cols-12 gap-6 min-h-[500px]">
                    {/* Sidebar */}
                    <div className="col-span-2 hidden md:block space-y-4">
                        <div className="h-8 w-8 bg-indigo-600 rounded mb-6 flex items-center justify-center text-white">
                            <Activity className="h-5 w-5" />
                        </div>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-4 w-full bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="col-span-12 md:col-span-10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                                <div className="h-6 w-48 bg-slate-200 rounded"></div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 bg-white border border-slate-200 rounded-full"></div>
                                <div className="h-8 w-8 bg-indigo-100 border border-indigo-200 rounded-full"></div>
                            </div>
                        </div>

                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-2">OPD Flow</div>
                                <div className="text-2xl font-bold text-slate-800">142</div>
                                <div className="text-xs text-green-600 font-medium mt-1">↑ 12% vs yesterday</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-2">Admissions</div>
                                <div className="text-2xl font-bold text-slate-800">28</div>
                                <div className="flex -space-x-2 mt-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-2">Active Doctors</div>
                                <div className="text-2xl font-bold text-indigo-600">18</div>
                                <div className="text-xs text-slate-400 mt-1">3 On Call</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-2">Rev. Today</div>
                                <div className="text-2xl font-bold text-emerald-600">₹ 2.4L</div>
                                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[70%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Split Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Patient List Preview */}
                            <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                                <div className="flex justify-between mb-4">
                                    <div className="h-5 w-32 bg-slate-200 rounded"></div>
                                    <div className="h-5 w-16 bg-slate-100 rounded"></div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs">{i + 10}</div>
                                            <div className="flex-1">
                                                <div className="h-4 w-32 bg-slate-200 rounded mb-1"></div>
                                                <div className="h-3 w-48 bg-slate-100 rounded"></div>
                                            </div>
                                            <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">Stable</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vitals/Alerts */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                                <div className="h-5 w-24 bg-slate-200 rounded mb-4"></div>
                                <div className="space-y-4">
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex gap-2 items-center mb-1">
                                            <HeartPulse className="h-4 w-4 text-red-600" />
                                            <div className="text-xs text-red-700 font-bold">Emergency</div>
                                        </div>
                                        <div className="text-sm text-slate-700">ICU Bed 04: O2 levels dropped.</div>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="text-xs text-amber-700 font-bold mb-1">Inventory Low</div>
                                        <div className="text-sm text-slate-700">Paracetamol IV stock below 20%.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Overlay Elements */}
            <div className="absolute -right-8 top-16 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 hidden lg:block z-20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">Discharge Approved</div>
                        <div className="text-xs text-slate-500">Bill Cleared • 2m ago</div>
                    </div>
                </div>
            </div>

            <div className="absolute -left-6 bottom-24 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-left-8 duration-1000 delay-500 hidden lg:block z-20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">New Appointment</div>
                        <div className="text-xs text-indigo-600 font-bold">Dr. Sharma • Ortho</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Landing = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">

            {/* Navigation Bar */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm py-0' : 'bg-transparent border-transparent py-2'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-slate-900 leading-none">HMS Pro</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#platform" className="hover:text-indigo-600 transition-colors">Platform</a>
                        <a href="#workflow" className="hover:text-indigo-600 transition-colors">Workflow</a>
                        <a href="#modules" className="hover:text-indigo-600 transition-colors">Modules</a>
                        <a href="#security" className="hover:text-indigo-600 transition-colors">Security</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="text-slate-600 hover:text-indigo-600 font-semibold"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
                            onClick={() => navigate('/login')}
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Button variant="ghost" size="icon">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl opacity-60 -translate-x-1/3 translate-y-1/4"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-bold uppercase tracking-wider mb-8">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        Built for Hospitals and Clinical Centers
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                        A Unified Platform for <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600">
                            Hospital Operations
                        </span>
                        <br /> and Care Delivery
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
                        Manage clinical workflows, patient records, billing, diagnostics, and administrative operations through a single secure system designed for modern healthcare institutions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg bg-indigo-900 hover:bg-indigo-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all rounded-xl"
                            // onClick={() => navigate('/dashboard')}
                            onClick={() => navigate('/login')}
                        >
                            Launch Dashboard
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl"
                        >
                            Request Demo
                        </Button>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative">
                        <HospitalDashboardVisual />
                        {/* Shadow/Grounding */}
                        <div className="absolute -inset-x-20 -bottom-20 h-40 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-20"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '1M', label: 'Patient Records Managed' },
                                { value: '250', label: 'Medical Staff Users' },
                                { value: '30', label: 'Departments Connected' },
                                { value: '99%', label: 'System Uptime' },
                            ].map((stat, i) => (
                                <CountUpStat key={i} {...stat} />
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            {/* Why Choose Our HMS Section */}
            <section id="platform" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Why HMS Pro?</h2>
                            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Why Healthcare Institutions Trust HMS</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Secure & Compliant', desc: 'Designed with strict access controls and healthcare data protection standards.', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { title: 'Cloud-Ready Architecture', desc: 'Scalable infrastructure supporting single and multi-location hospitals.', icon: Server, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { title: 'Clinician-Friendly Interface', desc: 'Optimized workflows for doctors, nurses, and administrative staff.', icon: UserCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { title: 'Real-Time Clinical Visibility', desc: 'Instant access to patient status, diagnostics, and departmental updates.', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
                                { title: 'Multi-Department Support', desc: 'Seamless coordination across OPD, IPD, labs, pharmacy, and billing.', icon: LayoutGrid, color: 'text-amber-600', bg: 'bg-amber-50' },
                                { title: 'Configurable Workflows', desc: 'Adapt processes to match hospital policies and clinical protocols.', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
                            ].map((feature, i) => (
                                <div key={i} className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                                    <div className={`h-12 w-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <RoleLoginSection />

            {/* Core Modules Section */}
            <section id="modules" className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Comprehensive Coverage</h2>
                            <h3 className="text-3xl md:text-5xl font-bold text-slate-900">Complete Hospital Operations, Connected</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Module Cards */}
                            {[
                                {
                                    title: 'Patient Management',
                                    icon: Users,
                                    items: ['Patient registration & demographics', 'OPD & IPD records', 'Admission, transfer & discharge']
                                },
                                {
                                    title: 'Clinical Workflow',
                                    icon: Stethoscope,
                                    items: ['Doctor consultations', 'Clinical notes & observations', 'Treatment & care plans']
                                },
                                {
                                    title: 'Laboratory & Diagnostics',
                                    icon: Microscope,
                                    items: ['Test order management', 'Result entry & reporting', 'Integration with clinical records']
                                },
                                {
                                    title: 'Pharmacy Management',
                                    icon: Pill,
                                    items: ['Medicine inventory', 'Prescription fulfillment', 'Stock & expiry tracking']
                                },
                                {
                                    title: 'Billing & Finance',
                                    icon: CreditCard,
                                    items: ['Patient billing & invoicing', 'Insurance & payment tracking', 'Financial summaries & audits']
                                },
                                {
                                    title: 'Staff Management',
                                    icon: UserCheckIcon,
                                    items: ['Doctor & staff profiles', 'Department mapping', 'Duty schedules']
                                },
                                {
                                    title: 'Reports & Analytics',
                                    icon: BarChart3,
                                    items: ['Clinical performance reports', 'Revenue & billing analysis', 'Operational dashboards']
                                }
                            ].map((module, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all hover:shadow-md hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-indigo-50 p-2 rounded-lg">
                                            <module.icon className="h-5 w-5 text-indigo-700" />
                                        </div>
                                        <h4 className="font-bold text-slate-900">{module.title}</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {module.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                                <div className="mt-1 h-1 w-1 rounded-full bg-slate-300 shrink-0"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Operations Impact Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Operational Excellence</h2>
                                <h3 className="text-3xl font-bold text-slate-900 mb-6">Designed to Improve Operational Efficiency and Patient Care</h3>

                                <div className="space-y-8 mt-8">
                                    {[
                                        { title: 'Streamlined Patient Flow', desc: 'Reduce delays from registration to discharge.' },
                                        { title: 'Operational Clarity', desc: 'Real-time visibility into hospital activities and resources.' },
                                        { title: 'Reduced Administrative Load', desc: 'Automate documentation and reporting.' },
                                        { title: 'Data-Driven Decisions', desc: 'Accurate insights for management and compliance.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-slate-600 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Stats Grid */}
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-indigo-600 mb-1">98%</div>
                                        <div className="text-sm font-medium text-slate-600">Process Accuracy</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-indigo-600 mb-1">65%</div>
                                        <div className="text-sm font-medium text-slate-600">Admin Effort Reduced</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-indigo-600 mb-1">40%</div>
                                        <div className="text-sm font-medium text-slate-600">Faster Turnaround</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-indigo-600 mb-1">100%</div>
                                        <div className="text-sm font-medium text-slate-600">Secure Handling</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden bg-indigo-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-blue-900"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Ready to Modernize Hospital Operations?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Support better clinical outcomes with a system built for efficiency, security, and scale.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            className="h-14 px-8 text-lg bg-white text-indigo-950 hover:bg-slate-50 shadow-xl rounded-xl font-bold"
                            onClick={() => navigate('/login')}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            className="h-14 px-8 text-lg bg-transparent border border-indigo-400 text-indigo-100 hover:bg-indigo-800 rounded-xl"
                        >
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get in Touch</h3>
                                <p className="text-slate-600 mb-8">
                                    Need a walkthrough or deployment details? Our team is ready to assist you with a personalized demo.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-indigo-600">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <span className="text-slate-700 font-medium">contact@hms-pro.com</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-indigo-600">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <span className="text-slate-700 font-medium">+91 98765 43210</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-indigo-600">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <span className="text-slate-700 font-medium">Tech Park, Bengaluru, India</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full min-h-[300px] bg-slate-200 rounded-xl overflow-hidden relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5987635923!2d77.6346!3d12.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzU5LjkiTiA3N8KwMzgnMDQuNiJF!5e0!3m2!1sen!2sin!4v1632991234567!5m2!1sen!2sin"
                                    className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 transition-all duration-500"
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                        <div className="max-w-sm text-center md:text-left">
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                <div className="bg-indigo-900 p-1.5 rounded-md text-white">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-900 text-xl">HMS Pro</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                A comprehensive hospital management system supporting clinical, administrative, and financial workflows.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-12 md:gap-24 justify-center md:justify-end w-full md:w-auto">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">Modules</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Security</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Support</h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">Documentation</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Status</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                        <div>© 2026 HMS Pro. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Icon for Staff (Use UserCircle roughly, or generic User)
const UserCheckIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
    </svg>
)

export default Landing;
