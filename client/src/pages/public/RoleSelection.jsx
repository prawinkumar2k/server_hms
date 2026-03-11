import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserPlus, FileText, FlaskConical, Pill, Stethoscope, Users } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'Admin',
            label: 'Administrator',
            icon: Shield,
            description: 'System Management & Oversight',
            color: 'bg-purple-600',
            hover: 'hover:bg-purple-700',
            light: 'bg-purple-50',
            text: 'text-purple-600'
        },
        {
            id: 'Doctor',
            label: 'Doctor',
            icon: Stethoscope,
            description: 'Patient Care & Consultations',
            color: 'bg-blue-600',
            hover: 'hover:bg-blue-700',
            light: 'bg-blue-50',
            text: 'text-blue-600'
        },
        {
            id: 'Receptionist',
            label: 'Receptionist',
            icon: Users,
            description: 'Front Desk & Appointments',
            color: 'bg-indigo-600',
            hover: 'hover:bg-indigo-700',
            light: 'bg-indigo-50',
            text: 'text-indigo-600'
        },
        {
            id: 'Lab Technician',
            label: 'Lab Technician',
            icon: FlaskConical,
            description: 'Diagnostics & Test Reports',
            color: 'bg-orange-600',
            hover: 'hover:bg-orange-700',
            light: 'bg-orange-50',
            text: 'text-orange-600'
        },
        {
            id: 'Pharmacist',
            label: 'Pharmacist',
            icon: Pill,
            description: 'Medicine & Inventory Control',
            color: 'bg-emerald-600',
            hover: 'hover:bg-emerald-700',
            light: 'bg-emerald-50',
            text: 'text-emerald-600'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="text-center mb-10 max-w-2xl">
                <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-6 border border-slate-100">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <span className="font-bold text-xl">H</span>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to HMS</h1>
                <p className="text-slate-500 text-lg">Please select your role to access your dedicated workspace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => navigate(`/login/${role.id}`)}
                        className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <div className={`h-12 w-12 rounded-xl ${role.light} ${role.text} flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300`}>
                            <role.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{role.label}</h3>
                        <p className="text-sm text-slate-500 font-medium">{role.description}</p>

                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                            <span className="text-slate-300">→</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-12 text-center text-xs text-slate-400">
                <p>© 2026 Hospital Management System. Secure Access Only.</p>
            </div>
        </div>
    );
};

export default RoleSelection;
