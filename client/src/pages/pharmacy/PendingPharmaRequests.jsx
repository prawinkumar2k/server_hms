import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Toast from '../../components/common/Toast';

const PendingPharmaRequests = () => {
    // Mock Data
    const [requests, setRequests] = useState([
        { id: 205, patient: 'Alice Brown', items: 'Paracetamol (10), Amoxicillin (5)', doctor: 'Dr. Emily', date: '2024-01-27 12:00' }
    ]);

    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleApprove = async (prescriptionId) => {
        try {
            const response = await fetch(`/api/prescriptions/${prescriptionId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: 'approved' })
            });

            if (!response.ok) {
                throw new Error('Failed to approve prescription');
            }

            // Remove from pending list
            setRequests(prev => prev.filter(req => req.id !== prescriptionId));
            showToast('Prescription approved successfully!', 'success');
        } catch (error) {
            console.error('Error approving prescription:', error);
            showToast('Failed to approve prescription. Please try again.', 'error');
        }
    };

    const handleReject = async (prescriptionId) => {
        try {
            const response = await fetch(`/api/prescriptions/${prescriptionId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: 'rejected' })
            });

            if (!response.ok) {
                throw new Error('Failed to reject prescription');
            }

            // Remove from pending list
            setRequests(prev => prev.filter(req => req.id !== prescriptionId));
            showToast('Prescription rejected successfully!', 'success');
        } catch (error) {
            console.error('Error rejecting prescription:', error);
            showToast('Failed to reject prescription. Please try again.', 'error');
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-800">Pending Pharmacy Approvals</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600 font-semibold text-sm">
                            <tr>
                                <th className="p-4">Prescription ID</th>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Doctor</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No pending requests</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-mono text-sm text-slate-500">PRE-{req.id}</td>
                                        <td className="p-4 font-medium text-slate-900">{req.patient}</td>
                                        <td className="p-4 text-slate-600">{req.items}</td>
                                        <td className="p-4 text-slate-600">{req.doctor}</td>
                                        <td className="p-4 text-slate-500 text-sm">{req.date}</td>
                                        <td className="p-4 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PendingPharmaRequests;
