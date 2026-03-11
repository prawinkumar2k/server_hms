import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Stethoscope, Users, FlaskConical, Pill, ArrowLeft, ChevronDown, Eye, EyeOff, Briefcase, LayoutDashboard } from 'lucide-react';

// Visual config for KNOWN roles (fallback styling for unknown roles)
const roleVisuals = {
    'Admin': {
        color: 'bg-purple-600',
        gradient: 'from-purple-600 to-purple-800',
        icon: Shield,
        title: 'Administrator Portal',
        subtitle: 'System Management Access',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
    },
    'Doctor': {
        color: 'bg-blue-600',
        gradient: 'from-blue-600 to-blue-800',
        icon: Stethoscope,
        title: 'Doctor Portal',
        subtitle: 'Clinical Access & Records',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2070',
    },
    'Receptionist': {
        color: 'bg-indigo-600',
        gradient: 'from-indigo-600 to-indigo-800',
        icon: Users,
        title: 'Reception',
        subtitle: 'Front Desk & Registration',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053',
    },
    'Lab Technician': {
        color: 'bg-orange-600',
        gradient: 'from-orange-600 to-orange-800',
        icon: FlaskConical,
        title: 'Laboratory',
        subtitle: 'Pathology & Diagnostics',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2070',
    },
    'Pharmacist': {
        color: 'bg-emerald-600',
        gradient: 'from-emerald-600 to-emerald-800',
        icon: Pill,
        title: 'Pharmacy',
        subtitle: 'Inventory & Dispensing',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1979',
    },
    'LAB_MASTER': {
        color: 'bg-red-600',
        gradient: 'from-red-600 to-red-800',
        icon: Shield,
        title: 'Lab Master',
        subtitle: 'Lab Supervision & Approval',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2070',
    },
    'PHARMA_MASTER': {
        color: 'bg-teal-600',
        gradient: 'from-teal-600 to-teal-800',
        icon: Shield,
        title: 'Pharma Master',
        subtitle: 'Pharmacy Supervision',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1979',
    },
    'HR': {
        color: 'bg-rose-600',
        gradient: 'from-rose-600 to-rose-800',
        icon: Briefcase,
        title: 'HR Portal',
        subtitle: 'Human Resources & Payroll',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070',
    }
};

// Default visual for roles not in the config
const defaultVisual = {
    color: 'bg-slate-600',
    gradient: 'from-slate-600 to-slate-800',
    icon: LayoutDashboard,
    title: 'Portal Access',
    subtitle: 'Secure Dashboard Login',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
};

// Role -> default landing path after login
const rolePaths = {
    'Admin': '/dashboard',
    'Doctor': '/doctor/consultations',
    'Pharmacist': '/pharmacy/dashboard',
    'Lab Technician': '/lab/dashboard',
    'Receptionist': '/hospital/reception',
    'LAB_MASTER': '/lab/dashboard',
    'PHARMA_MASTER': '/pharmacy/dashboard',
    'HR': '/payroll/employees',
};

const getVisualForRole = (roleName) => {
    if (!roleName) return null;
    // Case-insensitive lookup
    const key = Object.keys(roleVisuals).find(k => k.toLowerCase() === roleName.toLowerCase());
    return key ? roleVisuals[key] : { ...defaultVisual, title: `${roleName} Portal`, subtitle: `${roleName} Dashboard Access` };
};

const getPathForRole = (roleName) => {
    if (!roleName) return '/dashboard';
    const key = Object.keys(rolePaths).find(k => k.toLowerCase() === roleName.toLowerCase());
    return key ? rolePaths[key] : '/dashboard';
};

const Login = () => {
    const location = useLocation();
    const [dbRoles, setDbRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(location.state?.role || '');
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Fetch roles from DB on mount
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/auth/roles');
                if (response.ok) {
                    const roles = await response.json();
                    setDbRoles(roles);
                }
            } catch (err) {
                console.error('Failed to fetch roles:', err);
                // Fallback: use hardcoded role keys
                setDbRoles(Object.keys(roleVisuals).map((name, i) => ({ id: i, name })));
            } finally {
                setRolesLoading(false);
            }
        };
        fetchRoles();
    }, []);

    // Get visual config based on selected role
    const config = getVisualForRole(selectedRole);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.username, formData.password);

        if (result.success) {
            // Get the actual role from the JWT token (Source of Truth)
            const token = localStorage.getItem('token');
            let actualRole = selectedRole; // Fallback

            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    actualRole = payload.role;
                    console.log(`Authenticated as: ${actualRole}`);
                } catch (e) {
                    console.error("Token parse error", e);
                }
            }

            // Navigate to role-specific path
            const targetPath = getPathForRole(actualRole);
            navigate(targetPath, { replace: true });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex animate-in fade-in duration-500">
            {/* Left Side - Visual */}
            <div className={`hidden lg:flex w-1/2 relative overflow-hidden transition-colors duration-700 ease-in-out ${config ? config.color : 'bg-slate-700'}`}>
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                {/* Background Image with Overlay */}
                {config && (
                    <div key={selectedRole} className="absolute inset-0 animate-in fade-in duration-1000">
                        <img
                            src={config.image}
                            alt={config.title}
                            className="w-full h-full object-cover mix-blend-overlay opacity-50"
                        />
                    </div>
                )}

                <div className="relative z-20 flex flex-col justify-between p-12 text-white w-full">
                    <div>
                        <div className="flex items-center gap-3 opacity-90">
                            <Shield className="w-6 h-6" />
                            <span className="font-bold tracking-wide">HMS CORE</span>
                        </div>
                    </div>
                    <div>
                        {config ? (
                            <div key={config.title} className="animate-in slide-in-from-left-4 duration-500">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl">
                                    <config.icon className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold mb-4">{config.title}</h1>
                                <p className="text-white/80 text-lg max-w-md leading-relaxed">{config.subtitle}</p>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-left-4 duration-500">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold mb-4">Welcome to HMS</h1>
                                <p className="text-white/80 text-lg max-w-md leading-relaxed">Please select your role to continue</p>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-white/40">
                        Secure HMS Environment v2.4.0
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
                {/* Mobile Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Home
                </button>

                <div className="max-w-md w-full">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Please authenticate to access your dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                            <Shield className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Role Selection Dropdown - Dynamic from DB */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Select Role</label>
                            <div className="relative">
                                <select
                                    className={`w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all font-medium focus:bg-white appearance-none cursor-pointer ${selectedRole ? 'text-slate-900' : 'text-slate-400'}`}
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    disabled={rolesLoading}
                                >
                                    <option value="" disabled>{rolesLoading ? 'Loading roles...' : '-- Select Role --'}</option>
                                    {dbRoles.map(role => (
                                        <option key={role.id} value={role.name} className="text-slate-900">{role.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 focus:bg-white"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter your ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full px-4 py-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 focus:bg-white"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !selectedRole}
                            className={`w-full ${config ? config.color : 'bg-slate-400'} hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-opacity-20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 mt-4`}
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Access Dashboard'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        Protected by HMS Military-Grade Encryption.<br />
                        Unauthorized access attempts are logged.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
