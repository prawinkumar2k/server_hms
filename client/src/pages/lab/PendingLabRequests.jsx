import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_BADGES = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CORRECTION: 'bg-blue-100 text-blue-700',
};

const PendingLabRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // tracks which request id is being acted on
    const [error, setError] = useState('');
    const [remarksModal, setRemarksModal] = useState({ open: false, id: null, status: '', remarks: '' });

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/lab/requests/pending');
            if (!res.ok) throw new Error('Failed to fetch pending requests');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (id, status, remarks = '') => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/lab/request/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, remarks }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Action failed');
            }

            // Refresh list after action
            await fetchRequests();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Action failed');
        } finally {
            setActionLoading(null);
            setRemarksModal({ open: false, id: null, status: '', remarks: '' });
        }
    };

    const openRemarksModal = (id, status) => {
        setRemarksModal({ open: true, id, status, remarks: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pending Lab Approvals</h1>
                    <p className="text-sm text-slate-500 mt-1">Review and manage lab test requests</p>
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <Clock className="w-10 h-10 mb-3" />
                        <p className="font-medium">No pending requests</p>
                        <p className="text-sm mt-1">All lab requests have been processed</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600 font-semibold text-sm">
                            <tr>
                                <th className="p-4">Request ID</th>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Doctor</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-slate-500">#{req.id}</td>
                                    <td className="p-4 font-medium text-slate-900">{req.patient_name}</td>
                                    <td className="p-4 text-slate-600">{req.doctor_name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                                                req.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {req.priority || 'Normal'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        {req.request_date ? new Date(req.request_date).toLocaleString() : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[req.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {actionLoading === req.id ? (
                                            <div className="flex justify-center">
                                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                            </div>
                                        ) : req.status === 'PENDING' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleAction(req.id, 'APPROVED')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openRemarksModal(req.id, 'REJECTED')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openRemarksModal(req.id, 'CORRECTION')}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Correction Needed"
                                                >
                                                    <AlertCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-full block text-center">
                                                Processed
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Remarks Modal for Reject / Correction */}
            {remarksModal.open && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">
                            {remarksModal.status === 'REJECTED' ? 'Reject Request' : 'Request Correction'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {remarksModal.status === 'REJECTED'
                                ? 'Please provide a reason for rejecting this request.'
                                : 'Describe what needs to be corrected.'}
                        </p>
                        <textarea
                            value={remarksModal.remarks}
                            onChange={(e) => setRemarksModal(prev => ({ ...prev, remarks: e.target.value }))}
                            placeholder="Enter remarks..."
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setRemarksModal({ open: false, id: null, status: '', remarks: '' })}
                                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAction(remarksModal.id, remarksModal.status, remarksModal.remarks)}
                                disabled={!remarksModal.remarks.trim()}
                                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50 ${remarksModal.status === 'REJECTED'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-amber-600 hover:bg-amber-700'
                                    }`}
                            >
                                {remarksModal.status === 'REJECTED' ? 'Reject' : 'Request Correction'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingLabRequests;
