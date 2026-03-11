import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { User, Calendar, Briefcase, Award, ArrowLeft, Clock, Activity } from 'lucide-react';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [doctor, setDoctor] = useState(location.state?.doctor || null);
    const [loading, setLoading] = useState(!location.state?.doctor);

    useEffect(() => {
        if (!doctor) {
            fetchDoctorDetails();
        }
    }, [id]);

    const fetchDoctorDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/doctors/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setDoctor(await res.json());
            } else {
                const err = await res.json();
                console.error('Fetch error:', res.status, err);
                // Optional: set an error state to display to user
                if (res.status === 404) setDoctor(null); // Explicitly ensure null
            }
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Profile...</div>;
    if (!doctor) return <div className="p-8 text-center text-red-500">Doctor not found.</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700';
            case 'Inactive': return 'bg-slate-100 text-slate-600';
            case 'On Leave': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-500">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center text-slate-300">
                            <User className="w-16 h-16" />
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Dr. {doctor.full_name}</h1>
                            <p className="text-lg text-slate-500 font-medium">{doctor.specialization || 'General Physician'}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full font-bold text-sm ${getStatusColor(doctor.availability_status)}`}>
                            {doctor.availability_status}
                        </span>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Professional Info</h3>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Briefcase className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500">Department</p>
                                    <p className="font-semibold text-slate-800">{doctor.department}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Award className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500">Qualification</p>
                                    <p className="font-semibold text-slate-800">{doctor.qualification || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500">Experience</p>
                                    <p className="font-semibold text-slate-800">{doctor.experience_years} Years</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Details</h3>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><User className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500">Doctor ID</p>
                                    <p className="font-semibold text-slate-800 font-mono">DOC-{doctor.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-500">Age</p>
                                    <p className="font-semibold text-slate-800">{doctor.age || 'N/A'} Years</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {doctor.bio && (
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Biography</h3>
                            <p className="text-slate-600 leading-relaxed">{doctor.bio}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
