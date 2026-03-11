import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    Shield, Plus, Loader2, ArrowLeft, Pencil, Trash2, X, Check,
    Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../../services/userManagementService'; // Adjusted import path

const CreateRole = () => {
    const navigate = useNavigate();

    // Data
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Table state
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', type: 'custom', parent_role_id: '' });
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { fetchRoles(); }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await userService.getRoles();
            // userService returns the array directly, unlike axios which wraps in .data
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load roles:", error);
            toast.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    // =============================================
    // SORTING, FILTERING, PAGINATION
    // =============================================
    const filteredRoles = useMemo(() => {
        let data = [...roles];
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(r =>
                r.name.toLowerCase().includes(q) ||
                (r.description && r.description.toLowerCase().includes(q)) ||
                (r.type && r.type.toLowerCase().includes(q))
            );
        }
        data.sort((a, b) => {
            const av = (a[sortField] || '').toString().toLowerCase();
            const bv = (b[sortField] || '').toString().toLowerCase();
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return data;
    }, [roles, search, sortField, sortDir]);

    const totalPages = Math.ceil(filteredRoles.length / pageSize) || 1;
    const pagedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => { setCurrentPage(1); }, [search, pageSize]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUp className="w-3.5 h-3.5 text-slate-300" />;
        return sortDir === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
            : <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />;
    };

    // =============================================
    // CRUD HANDLERS
    // =============================================
    const openCreateModal = () => {
        setEditingRole(null);
        setFormData({ name: '', description: '', type: 'custom', parent_role_id: '' });
        setShowModal(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            type: role.type || 'custom',
            parent_role_id: role.parent_role_id || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('Role name is required');

        setSubmitting(true);
        try {
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                type: formData.type,
                parent_role_id: formData.parent_role_id || null
            };

            if (editingRole) {
                await userService.updateRole(editingRole.id, payload);
                toast.success('Role updated successfully');
            } else {
                await userService.createRole(payload);
                toast.success('Role created successfully');
            }
            setShowModal(false);
            fetchRoles();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await userService.deleteRole(deleteTarget.id);
            toast.success(`Role "${deleteTarget.name}" deleted`);
            setDeleteTarget(null);
            fetchRoles();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to delete role');
        }
    };

    const isSystemRole = (role) => role.type === 'system';

    // Get user count per role for display
    const getUserCount = (roleName) => {
        // This would ideally come from the backend but keeping it client-side for now
        return null;
    };

    // =============================================
    // RENDER
    // =============================================
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/users/list')}
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Role Management</h1>
                        <p className="text-slate-500">Create, edit, and manage system roles</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Create Role
                </button>
            </div>

            {/* Search & Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search roles by name, description, or type..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Show</span>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                    >
                        {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span>entries</span>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-16">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 w-12 text-center">#</th>
                                        <th className="p-4 cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('name')}>
                                            <div className="flex items-center gap-1">Role Name <SortIcon field="name" /></div>
                                        </th>
                                        <th className="p-4 cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('description')}>
                                            <div className="flex items-center gap-1">Description <SortIcon field="description" /></div>
                                        </th>
                                        <th className="p-4 cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('type')}>
                                            <div className="flex items-center gap-1">Type <SortIcon field="type" /></div>
                                        </th>
                                        <th className="p-4 cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('created_at')}>
                                            <div className="flex items-center gap-1">Created <SortIcon field="created_at" /></div>
                                        </th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pagedRoles.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-slate-400">
                                                {search ? 'No roles match your search.' : 'No roles defined yet.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        pagedRoles.map((role, idx) => (
                                            <tr key={role.id} className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="p-4 text-center text-sm text-slate-400 font-mono">
                                                    {(currentPage - 1) * pageSize + idx + 1}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${isSystemRole(role)
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-indigo-100 text-indigo-700'
                                                            }`}>
                                                            {role.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">{role.name}</div>
                                                            {isSystemRole(role) && (
                                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PROTECTED</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 max-w-[300px]">
                                                    <span className="line-clamp-2">{role.description || <span className="text-slate-300 italic">No description</span>}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${role.type === 'system'
                                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                        }`}>
                                                        {role.type || 'custom'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500">
                                                    {role.created_at ? new Date(role.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => openEditModal(role)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit Role"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        {!isSystemRole(role) && (
                                                            <button
                                                                onClick={() => setDeleteTarget(role)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Role"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-100 gap-3">
                            <div className="text-sm text-slate-500">
                                Showing {filteredRoles.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRoles.length)} of {filteredRoles.length} roles
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'hover:bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* =============================================
                CREATE / EDIT MODAL
            ============================================= */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Shield className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
                                    <p className="text-xs text-slate-500">{editingRole ? `Editing: ${editingRole.name}` : 'Define a new role for the system'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {editingRole && isSystemRole(editingRole) && (
                                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>System role — name cannot be changed, but you can update the description.</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Chief Surgeon"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                                    required
                                    disabled={editingRole && isSystemRole(editingRole)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Brief description of this role's responsibilities..."
                                    rows="3"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData(f => ({ ...f, type: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-100"
                                        disabled={editingRole && isSystemRole(editingRole)}
                                    >
                                        <option value="custom">Custom</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent Role</label>
                                    <select
                                        value={formData.parent_role_id}
                                        onChange={(e) => setFormData(f => ({ ...f, parent_role_id: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    >
                                        <option value="">None (Top Level)</option>
                                        {roles.filter(r => !editingRole || r.id !== editingRole.id).map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !formData.name.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    {editingRole ? 'Update Role' : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =============================================
                DELETE CONFIRMATION MODAL
            ============================================= */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 text-center space-y-4">
                            <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-7 h-7 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Delete Role</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Are you sure you want to delete <span className="font-semibold text-slate-700">"{deleteTarget.name}"</span>?
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateRole;
