import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Save, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const Attendance = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    useEffect(() => {
        fetchDailyAttendance();
    }, [date]);

    const fetchShifts = async () => {
        try {
            const res = await fetch('/api/payroll/shifts', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setShifts(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchDailyAttendance = async () => {
        if (!date) return; // Don't fetch if date is invalid
        setLoading(true);
        try {
            const res = await fetch(`/api/payroll/attendance/daily?date=${date}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                const data = await res.json();
                setAttendanceData(Array.isArray(data) ? data : []);
            } else {
                console.error("Failed to fetch attendance:", await res.text());
                setAttendanceData([]);
            }
        } catch (e) {
            console.error(e);
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMark = async (empId, status, shiftId) => {
        // Validate shift selection
        const resolvedShiftId = shiftId || shifts[0]?.id;
        if (!resolvedShiftId) {
            showToast('Please select a shift first', 'error');
            return;
        }

        // Optimistic Update
        const updatedData = attendanceData.map(emp => {
            if (emp.employee_id === empId) {
                return { ...emp, status, shift_id: resolvedShiftId };
            }
            return emp;
        });
        setAttendanceData(updatedData);

        // Find the specific employee row to send
        const emp = updatedData.find(e => e.employee_id === empId);

        try {
            const res = await fetch('/api/payroll/attendance/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    employeeId: empId,
                    date,
                    shiftId: Number(resolvedShiftId),
                    status,
                    inTime: emp.in_time || null,
                    outTime: emp.out_time || null
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Failed to mark attendance');
            }

            showToast(`${status === 'Present' ? 'Present' : 'Absent'} marked for ${emp.first_name}`);
        } catch (e) {
            console.error('Failed to sync attendance', e);
            showToast(e.message || 'Failed to mark attendance', 'error');
            fetchDailyAttendance(); // Revert on failure
        }
    };

    const handleShiftChange = (empId, newShiftId) => {
        const emp = attendanceData.find(e => e.employee_id === empId);
        if (emp.status === 'Present') {
            handleMark(empId, 'Present', newShiftId);
        } else {
            // Just update local state if absent/not marked yet, wait for status click
            setAttendanceData(attendanceData.map(e => e.employee_id === empId ? { ...e, shift_id: newShiftId } : e));
        }
    };

    const changeDate = (days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().split('T')[0]);
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Toast Notification */}
                {toast && (
                    <div className="fixed top-6 right-6 z-50 animate-slideIn">
                        <div className={`flex items-center gap-3 bg-white border shadow-2xl rounded-xl px-5 py-4 min-w-[280px] ${toast.type === 'error' ? 'border-red-200' : 'border-slate-200'
                            }`}>
                            <div className={`p-1.5 rounded-full ${toast.type === 'error' ? 'bg-red-100' : 'bg-emerald-100'}`}>
                                {toast.type === 'error'
                                    ? <XCircle className="h-5 w-5 text-red-600" />
                                    : <CheckCircle className="h-5 w-5 text-emerald-600" />
                                }
                            </div>
                            <p className="text-sm font-bold text-slate-800">{toast.message}</p>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-rose-100/50 rounded-lg">
                                <Clock className="h-6 w-6 text-rose-600" />
                            </div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-rose-900 tracking-tight">Daily Attendance</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">Mark employee presence and manage shifts.</p>
                    </div>

                    <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft className="h-5 w-5" /></button>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 font-bold text-slate-700 font-mono text-sm border-none focus:ring-0 cursor-pointer bg-transparent"
                        />
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </div>

                <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4">Shift</th>
                                        <th className="px-6 py-4 text-center">In Time</th>
                                        <th className="px-6 py-4 text-center">Out Time</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-12 text-center text-slate-400">Loading roster...</td></tr>
                                    ) : attendanceData.length === 0 ? (
                                        <tr><td colSpan="6" className="p-12 text-center text-slate-400">No active employees found.</td></tr>
                                    ) : (
                                        attendanceData.map((emp) => (
                                            <tr key={emp.employee_id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-3">
                                                    <div className="font-bold text-slate-700">{emp.first_name} {emp.last_name}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{emp.employee_code}</div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-500 text-xs">{emp.department}</td>
                                                <td className="px-6 py-3">
                                                    <select
                                                        className="bg-slate-50 border border-slate-200 rounded text-xs py-1 px-2 focus:ring-rose-500"
                                                        value={emp.shift_id || ''}
                                                        onChange={(e) => handleShiftChange(emp.employee_id, e.target.value)}
                                                    >
                                                        <option value="">Select Shift</option>
                                                        {shifts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)})</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-3 text-center text-slate-500 font-mono">
                                                    {emp.in_time ? emp.in_time.slice(0, 5) : '--:--'}
                                                </td>
                                                <td className="px-6 py-3 text-center text-slate-500 font-mono">
                                                    {emp.out_time ? emp.out_time.slice(0, 5) : '--:--'}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleMark(emp.employee_id, 'Present', emp.shift_id)}
                                                            className={`p-1.5 rounded-lg transition-all ${emp.status === 'Present' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleMark(emp.employee_id, 'Absent', emp.shift_id)}
                                                            className={`p-1.5 rounded-lg transition-all ${emp.status === 'Absent' ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-1' : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600'}`}
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                    </div>
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

export default Attendance;
