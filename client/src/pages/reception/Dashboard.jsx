import React, { useState, useEffect } from 'react';
import { Users, UserPlus, CalendarCheck, Clock, Phone, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';

const ReceptionDashboard = () => {
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [opdVisits, setOpdVisits] = useState([]);

    // Stats State
    const [stats, setStats] = useState({
        todayAppointments: 0,
        checkedIn: 0,
        waiting: 0,
        doctorsActive: 0
    });

    // Fetch Data on Component Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];

                // Parallel Fetch
                const [apptRes, opdRes, docsRes] = await Promise.all([
                    fetch(`/api/appointments?date=${today}`),
                    fetch('/api/opd'),
                    fetch('/api/doctors')
                ]);

                if (apptRes.ok && opdRes.ok) {
                    const apptData = await apptRes.json();
                    const opdData = await opdRes.json();
                    const docsData = docsRes.ok ? await docsRes.json() : [];

                    // Filter OPD for today
                    const todayOpd = opdData.filter(v =>
                        new Date(v.visit_date).toISOString().split('T')[0] === today
                    );

                    setAppointments(apptData);
                    setOpdVisits(todayOpd);

                    // Count Active Doctors from API
                    const activeDocsCount = docsData.filter(d => d.availability_status === 'Active').length;

                    setStats({
                        todayAppointments: apptData.length,
                        checkedIn: todayOpd.length,
                        waiting: apptData.filter(a => a.status === 'Scheduled' || a.status === 'Waiting').length,
                        doctorsActive: activeDocsCount
                    });
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { label: "Today's Appointments", value: stats.todayAppointments, icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50", link: '/hospital/appointments' },
        { label: "OPD Check-Ins", value: stats.checkedIn, icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50", link: '/hospital/reception' },
        { label: "In Waiting", value: stats.waiting, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Active Doctors", value: stats.doctorsActive, icon: Users, color: "text-purple-600", bg: "bg-purple-50", link: '/reception/doctors' },
    ];

    return (
        <PageTransition>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 p-1">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reception</h1>
                        <p className="text-slate-500 mt-1">Overview of today's patient flow and activities.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate('/hospital/reception')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        >
                            <UserPlus className="h-4 w-4 mr-2" /> New Registration
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card
                            key={i}
                            className={`border-none shadow-sm hover:shadow-md transition-all duration-200 ${stat.link ? 'cursor-pointer' : ''}`}
                            onClick={() => stat.link && navigate(stat.link)}
                        >
                            <CardContent className="p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{loading ? '-' : stat.value}</h3>
                                </div>
                                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Recent Content */}
                    <Card className="xl:col-span-2 border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-800">Recent OPD Check-ins</CardTitle>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600">View All</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400">Loading activity...</div>
                            ) : opdVisits.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 bg-slate-50/50">
                                    <div className="mb-2 flex justify-center"><Users className="h-10 w-10 opacity-20" /></div>
                                    No patients checked in today yet.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {opdVisits.slice(0, 5).map((visit, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                    {visit.patient_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{visit.patient_name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-2">
                                                        <span>{visit.gender}, {visit.age}y</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-indigo-600">{visit.doctor_name}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    {visit.status || 'Checked In'}
                                                </span>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(visit.visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions & Notices */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="py-4 px-6 border-b border-slate-100">
                                <CardTitle className="text-base font-semibold text-slate-800">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50" onClick={() => navigate('/hospital/reception')}>
                                    <Search className="h-4 w-4 mr-3" />
                                    Search / Register Patient
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50" onClick={() => navigate('/hospital/appointments')}>
                                    <CalendarCheck className="h-4 w-4 mr-3" />
                                    New Appointment
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50" onClick={() => navigate('/reception/doctors')}>
                                    <Phone className="h-4 w-4 mr-3" />
                                    Doctor Status / Directory
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Today's Notice */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-200 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Hospital Notice</h4>
                                    <p className="text-indigo-100 text-sm mt-1 leading-relaxed">
                                        Dr. Wilson is unavailable today (11th Jan). Please reschedule his OPD appointments to Dr. Chen.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ReceptionDashboard;
