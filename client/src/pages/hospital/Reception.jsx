import React, { useState } from 'react';
import {
    User, Phone, Calendar, Clock, MapPin,
    Stethoscope, CreditCard, Save, RotateCcw,
    X, Plus, Search, FileText, ShieldAlert, Upload, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';

const Reception = () => {
    // Current Date/Time for Token
    const today = new Date().toISOString().split('T')[0];
    const { patients, addPatient, fetchPatients } = usePatients();
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    // Form State
    const [formData, setFormData] = useState({
        patientId: (patients.length + 1).toString(),
        mobileNo: '',
        patientName: '',
        age: '',
        gender: 'Male',
        bloodGroup: '',
        address: '',
        doctorName: '',
        refDoctorName: '',
        opFee: 0
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editPatient, setEditPatient] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add new patient to context
        const newPatient = {
            id: formData.patientId,
            name: formData.patientName,
            mobile: formData.mobileNo || formData.phone, // Handle phone/mobile mapping if needed
            age: formData.age,
            gender: formData.gender,
            doctor: formData.doctorName,
            opFee: formData.opFee,
            address: formData.address,
            tokenDate: `T${patients.length + 1}-${today}`,
            date: today,
            status: "Waiting" // Default status for new patients
        };
        const result = await addPatient(newPatient);

        // Upload photo if one was selected
        if (result && result.id && photoFile) {
            try {
                const photoFormData = new FormData();
                photoFormData.append('photo', photoFile);

                const token = localStorage.getItem('token');
                await fetch(`/api/patients/${result.id}/photo`, {
                    method: 'POST',
                    headers: token ? {
                        'Authorization': `Bearer ${token}`
                    } : {},
                    body: photoFormData
                });

                // Refresh list with photo
                await fetchPatients();
            } catch (err) {
                console.error("Failed to upload photo", err);
                alert("Patient saved, but failed to upload photo.");
            }
        }

        // Reset form
        setFormData({
            patientId: (patients.length + 2).toString(),
            mobileNo: '',
            patientName: '',
            age: '',
            gender: 'Male',
            bloodGroup: '',
            address: '',
            doctorName: '',
            refDoctorName: '',
            opFee: 0
        });
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    // Handle Edit Button Click
    const handleEdit = (patient) => {
        setEditPatient({
            id: patient.id,
            patientId: patient.id,
            mobileNo: patient.mobile || '',
            patientName: patient.name || '',
            age: patient.age || '',
            gender: patient.gender || 'Male',
            bloodGroup: patient.bloodGroup || '',
            address: patient.address || '',
            doctorName: patient.doctor || '',
            refDoctorName: patient.refDoctorName || '',
            opFee: patient.opFee || 0
        });
        setEditModalOpen(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editPatient) return;

        try {
            const res = await fetch(`/api/patients/${editPatient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: editPatient.mobileNo,
                    name: editPatient.patientName,
                    age: editPatient.age,
                    gender: editPatient.gender,
                    bloodGroup: editPatient.bloodGroup,
                    address: editPatient.address,
                    doctor: editPatient.doctorName,
                    refDoctorName: editPatient.refDoctorName,
                    opFee: editPatient.opFee
                })
            });

            if (res.ok) {
                setEditModalOpen(false);
                setEditPatient(null);
                // Refresh patient list - you may need to call fetchPatients if available
                window.location.reload(); // Simple refresh for now
            } else {
                const err = await res.json();
                alert(err.message || 'Error updating patient');
            }
        } catch (err) {
            console.error('Edit error:', err);
            alert('Error updating patient');
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditPatient(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageTransition>
            <div className="space-y-6 max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reception - Patient Details</h1>
                        <p className="text-slate-500">Register new out-patients and manage tokens.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-primary-50 px-4 py-2 rounded-lg border border-primary-100 flex items-center gap-2 text-primary-700 font-bold">
                            <span className="text-xs uppercase tracking-wider text-primary-500">Token</span>
                            <span className="text-xl">#{patients.length + 1}</span>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {today}
                        </div>
                    </div>
                </div>

                {/* Main Registration Form */}
                {!isAdmin && (
                    <Card className="border-t-4 border-t-primary-600 shadow-lg">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <User className="h-4 w-4" /> Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">

                                {/* Row 1 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Patient ID</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="patientId"
                                            value={formData.patientId}
                                            readOnly
                                            className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-600 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Mobile No</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium"
                                            placeholder="Enter mobile number"
                                        />
                                        <button type="button" className="absolute right-2 top-2 p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                                            <Search className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Patient Name</label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-bold text-slate-900"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                {/* Row 2 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Children</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Blood Group</label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                        <option>AB+</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">OP Fee</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="number"
                                            name="opFee"
                                            value={formData.opFee}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-bold text-slate-900"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="Street Address, City"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Doctor Name</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <select
                                            name="doctorName"
                                            value={formData.doctorName}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">Select Doctor</option>
                                            <option>Dr. Manoj</option>
                                            <option>Dr. Praveen</option>
                                            <option>Dr. K. Kumaran</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Ref Doctor Name</label>
                                    <input
                                        type="text"
                                        name="refDoctorName"
                                        value={formData.refDoctorName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Referral Dr."
                                    />
                                </div>

                                {/* Patient Photo Upload */}
                                <div className="space-y-2 md:col-span-4">
                                    <label className="text-sm font-medium text-slate-700">Patient Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-slate-300" />
                                            )}
                                            {photoPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removePhoto}
                                                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                id="photo-upload"
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Choose Photo
                                            </label>
                                            <p className="mt-1 text-xs text-slate-500">Max size 2MB. Format: JPG, PNG</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Restriction Warning */}
                                {isAdmin && (
                                    <div className="md:col-span-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 mt-2">
                                        <div className="p-1 bg-amber-100 rounded-full text-amber-600 mt-0.5">
                                            <ShieldAlert className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-amber-800">Registration Restricted</p>
                                            <p className="text-xs text-amber-700">Administrative accounts are restricted from creating patient records directly. Please use a Receptionist account.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="md:col-span-4 flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <Button type="button" variant="ghost" className="text-slate-500 gap-2">
                                        <RotateCcw className="h-4 w-4" /> Clear
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isAdmin}
                                        className={`gap-2 min-w-[120px] transition-all ${isAdmin ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200"}`}
                                    >
                                        <Save className="h-4 w-4" /> Submit
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Patients Grid */}
                <Card>
                    <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Recent Registrations</CardTitle>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search details..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Patient ID</th>
                                    <th className="px-4 py-3">Patient Name</th>
                                    <th className="px-4 py-3">Mobile No</th>
                                    <th className="px-4 py-3">Age/Gender</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">OP Fee</th>
                                    <th className="px-4 py-3">Token Date</th>
                                    <th className="px-4 py-3">Photo</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patients.filter(patient =>
                                    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    patient.mobile?.includes(searchTerm) ||
                                    patient.id?.toString().includes(searchTerm)
                                ).map((patient, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{patient.id}</td>
                                        <td className="px-4 py-3 font-bold text-primary-700">{patient.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{patient.mobile}</td>
                                        <td className="px-4 py-3 text-slate-600">{patient.age} / {patient.gender}</td>
                                        <td className="px-4 py-3 text-slate-600">{patient.doctor}</td>
                                        <td className="px-4 py-3 font-medium text-green-600">₹ {patient.opFee}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{patient.tokenDate}</td>
                                        <td className="px-4 py-3">
                                            {patient.photo ? (
                                                <img
                                                    src={`/api/patients/${patient.id}/photo?t=${patient.photo}&token=${localStorage.getItem('token')}`}
                                                    alt={patient.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {!isAdmin ? (
                                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => handleEdit(patient)}>Edit</Button>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">View Only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Edit Patient Modal */}
                {editModalOpen && editPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg">Edit Patient Details</h3>
                                <Button variant="ghost" size="sm" onClick={() => { setEditModalOpen(false); setEditPatient(null); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Patient ID</label>
                                        <input
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-100 font-bold"
                                            value={editPatient.patientId}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Mobile No</label>
                                        <input
                                            name="mobileNo"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={editPatient.mobileNo}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Patient Name</label>
                                    <input
                                        name="patientName"
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none font-bold"
                                        value={editPatient.patientName}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Age</label>
                                        <input
                                            name="age"
                                            type="number"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={editPatient.age}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Gender</label>
                                        <select
                                            name="gender"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={editPatient.gender}
                                            onChange={handleEditInputChange}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Children</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={editPatient.bloodGroup}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="">Select</option>
                                            <option>A+</option>
                                            <option>A-</option>
                                            <option>B+</option>
                                            <option>B-</option>
                                            <option>O+</option>
                                            <option>O-</option>
                                            <option>AB+</option>
                                            <option>AB-</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Address</label>
                                    <input
                                        name="address"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                        value={editPatient.address}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Doctor Name</label>
                                        <select
                                            name="doctorName"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                                            value={editPatient.doctorName}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="">Select Doctor</option>
                                            <option>Dr. Manoj</option>
                                            <option>Dr. Praveen</option>
                                            <option>Dr. K. Kumaran</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">OP Fee</label>
                                        <input
                                            name="opFee"
                                            type="number"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500/20 outline-none font-bold"
                                            value={editPatient.opFee}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => { setEditModalOpen(false); setEditPatient(null); }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                        <Save className="h-4 w-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition >
    );
};

export default Reception;
