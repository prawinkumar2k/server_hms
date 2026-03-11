import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/userManagementService';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Loader2, CheckSquare, Square, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateNewUser = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [modules, setModules] = useState({});

    const [form, setForm] = useState({
        fullName: '',
        username: '',
        password: '',
        role: '',
        staffId: '',
        accessModules: []
    });

    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [staffData, rolesData, modulesData] = await Promise.all([
                userService.getStaffList(),
                userService.getRoles(),
                userService.getModules()
            ]);
            // Backend returns array/object directly now, checking if it's fallback empty array
            setStaffList(Array.isArray(staffData) ? staffData : []);
            setRoles(Array.isArray(rolesData) ? rolesData : []);
            setModules(modulesData || {});
        } catch (error) {
            toast.error('Failed to load form data');
        } finally {
            setInitLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.createUser({
                ...form,
                full_name: form.fullName, // Map to backend expected field
                staff_id: form.staffId,
                module_access: form.accessModules
            });
            toast.success('User created successfully!');
            navigate('/admin/users/list');
        } catch (error) {
            toast.error(error.message || 'Failed to create user');
            setLoading(false);
        }
    };

    const toggleModule = (key) => {
        setForm(prev => {
            const current = prev.accessModules;
            if (current.includes(key)) {
                return { ...prev, accessModules: current.filter(k => k !== key) };
            } else {
                return { ...prev, accessModules: [...current, key] };
            }
        });
    };

    const toggleCategory = (categoryModules) => {
        const keys = categoryModules.map(m => m.module_key);
        const allSelected = keys.every(k => form.accessModules.includes(k));

        setForm(prev => {
            let newAccess = [...prev.accessModules];
            if (allSelected) {
                // Deselect all
                newAccess = newAccess.filter(k => !keys.includes(k));
            } else {
                // Select all
                keys.forEach(k => {
                    if (!newAccess.includes(k)) newAccess.push(k);
                });
            }
            return { ...prev, accessModules: newAccess };
        });
    };

    if (initLoading) return <div className="p-8 text-center text-slate-500">Loading form...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Toaster position="top-right" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/users/list')}
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-indigo-600" />
                        Create New User
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* 1. Account Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Account Credentials</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={form.fullName}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Role & Association</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={form.role}
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Link Employee (Optional)</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={form.staffId}
                                    onChange={e => setForm({ ...form, staffId: e.target.value })}
                                >
                                    <option value="">No Link</option>
                                    {staffList.map(s => <option key={s.id} value={s.id}>{s.staff_name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Module Access */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">System Access Permissions</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(modules).map(([category, mods]) => (
                                <div key={category} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                                        <h4 className="font-semibold text-slate-700 capitalize">{category}</h4>
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(mods)}
                                            className="text-xs text-indigo-600 font-medium hover:underline"
                                        >
                                            Toggle All
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {mods.map(mod => {
                                            const isSelected = form.accessModules.includes(mod.module_key);
                                            return (
                                                <div
                                                    key={mod.module_key}
                                                    onClick={() => toggleModule(mod.module_key)}
                                                    className={`cursor-pointer flex items-center gap-2 p-2 rounded transition-colors ${isSelected ? 'bg-white shadow-sm ring-1 ring-indigo-100' : 'hover:bg-slate-100'}`}
                                                >
                                                    {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                                                    <span className={`text-sm ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>{mod.module_name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users/list')}
                            className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewUser;
