import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/userManagementService';
import toast, { Toaster } from 'react-hot-toast';
import { Pencil, Loader2, CheckSquare, Square, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [modules, setModules] = useState({});

    // Form
    const [form, setForm] = useState({
        fullName: '',
        username: '',
        password: '', // Only sent if changed
        role: '',
        staffId: '',
        accessModules: []
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [userData, rolesData, modulesData, staffData] = await Promise.all([
                userService.getUserById(id),
                userService.getRoles(),
                userService.getModules(),
                userService.getStaffList()
            ]);

            setUser(userData);
            setRoles(Array.isArray(rolesData) ? rolesData : []);
            setModules(modulesData || {});
            setStaffList(Array.isArray(staffData) ? staffData : []);

            // Populate Form
            setForm({
                fullName: userData.full_name || '',
                username: userData.username,
                password: '',
                role: userData.role,
                staffId: userData.staff_id || '',
                accessModules: userData.module_access ? userData.module_access.split(',') : []
            });
        } catch (error) {
            toast.error('Failed to load user details');
            navigate('/admin/users/list');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                full_name: form.fullName, // Pass full_name
                username: form.username,
                role: form.role,
                staff_id: form.staffId,
                module_access: form.accessModules
            };

            if (form.password) payload.password = form.password;

            await userService.updateUser(id, payload);
            toast.success('User updated successfully');
            setTimeout(() => navigate('/admin/users/list'), 1000);
        } catch (error) {
            toast.error('Update failed');
            setSaving(false);
        }
    };

    const toggleModule = (key) => {
        setForm(prev => {
            const current = prev.accessModules;
            return {
                ...prev,
                accessModules: current.includes(key)
                    ? current.filter(k => k !== key)
                    : [...current, key]
            };
        });
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit User Account</h1>
                    <p className="text-slate-500">Modify permissions and details for <span className="font-semibold text-indigo-600">@{user.username}</span></p>
                </div>
                <button
                    onClick={() => navigate('/admin/users/list')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors font-medium shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Credentials */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Pencil className="w-4 h-4 text-indigo-600" /> Account Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={form.fullName}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                    value={form.username}
                                    disabled
                                    title="Username cannot be changed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={form.role}
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                >
                                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Staff Link</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={form.staffId}
                                    onChange={e => setForm({ ...form, staffId: e.target.value })}
                                >
                                    <option value="">No Active Link</option>
                                    {staffList.map(s => <option key={s.id} value={s.id}>{s.staff_name}</option>)}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reset Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password to reset"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 placeholder:text-slate-400"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                                <p className="text-xs text-slate-400 mt-1">Leave blank to keep current password.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Permissions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">Module Access Rights</h3>
                            <div className="text-sm text-slate-500">
                                {form.accessModules.length} Modules Enabled
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(modules).map(([category, mods]) => (
                                <div key={category} className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                                    <div className="px-4 py-2 bg-slate-100/50 border-b border-slate-200 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                        {category}
                                    </div>
                                    <div className="p-3 space-y-1">
                                        {mods.map(mod => {
                                            const isActive = form.accessModules.includes(mod.module_key);
                                            return (
                                                <div
                                                    key={mod.module_key}
                                                    onClick={() => toggleModule(mod.module_key)}
                                                    className={`
                                                        flex items-center gap-3 p-2 rounded cursor-pointer transition-all
                                                        ${isActive ? 'bg-white shadow-sm border border-indigo-100' : 'hover:bg-slate-200/50'}
                                                    `}
                                                >
                                                    {isActive
                                                        ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                                                        : <Square className="w-4 h-4 text-slate-300 shrink-0" />
                                                    }
                                                    <span className={`text-sm ${isActive ? 'text-indigo-900 font-medium' : 'text-slate-500'}`}>
                                                        {mod.module_name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
