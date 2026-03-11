import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, TrendingUp, AlertCircle, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import PageTransition from '../../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const PayrollDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        onLeave: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];

            // Parallel Fetch
            const [empRes, attRes] = await Promise.all([
                fetch('/api/payroll/employees', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`/api/payroll/attendance/daily?date=${today}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const employees = await empRes.json();
            const attendance = await attRes.json();

            // Calculate Stats
            const total = employees.length || 0;
            const present = attendance.filter(a => a.status === 'Present').length || 0;
            const absent = attendance.filter(a => a.status === 'Absent').length || 0;
            // Note: In our current system, default is 'Absent' if not marked, so this might be high. 
            // We might want to distinguish "Not Marked" vs "Marked Absent", but for now use status.

            const leaves = attendance.filter(a => a.status === 'Leave').length || 0;

            setStats({
                totalEmployees: total,
                presentToday: present,
                absentToday: absent,
                onLeave: leaves
            });

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR & Payroll Dashboard</h1>
                        <p className="text-slate-500">Overview of employee stats, attendance, and payroll.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Employees"
                        value={loading ? "..." : stats.totalEmployees}
                        icon={Users}
                        color="bg-blue-600"
                        subtext="Active staff members"
                    />
                    <StatCard
                        title="Present Today"
                        value={loading ? "..." : stats.presentToday}
                        icon={CheckCircle}
                        color="bg-emerald-500"
                        subtext="Checked in staff"
                    />
                    <StatCard
                        title="Absent / Not Marked"
                        value={loading ? "..." : stats.absentToday}
                        icon={XCircle}
                        color="bg-rose-500"
                        subtext="Needs attention"
                    />
                    <StatCard
                        title="On Leave"
                        value={loading ? "..." : stats.onLeave}
                        icon={Calendar}
                        color="bg-amber-500"
                        subtext="Approved leaves"
                    />
                </div>

                {/* Quick Actions & Recent Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <button
                                onClick={() => navigate('/payroll/employees')}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-blue-600 group-hover:border-blue-300">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-slate-700">Add New Employee</span>
                                </div>
                                <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                            </button>

                            <button
                                onClick={() => navigate('/payroll/attendance')}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-600 group-hover:border-emerald-300">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-slate-700">Mark Today's Attendance</span>
                                </div>
                                <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                            </button>

                            <button
                                onClick={() => navigate('/payroll/salaries')}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600 group-hover:border-purple-300">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-slate-700">Process Salary</span>
                                </div>
                                <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-purple-500" />
                            </button>
                        </CardContent>
                    </Card>

                    {/* Placeholder for Recent Activity */}
                    <Card className="border-slate-200 shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Payroll Status (Current Month)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                                <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                                <p>Payroll processing for the current month is pending.</p>
                                <p className="text-sm mt-1">Navigate to Salary Details to generate payslips.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageTransition>
    );
};

export default PayrollDashboard;
