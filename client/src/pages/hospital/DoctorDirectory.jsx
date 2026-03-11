import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Mail, Clock, MapPin, Award, User, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

const DoctorDirectory = () => {
    const navigate = useNavigate();
    // Mock Data mimicking the hardcoded doctors in Reception + some extras for fullness
    const doctors = [
        {
            id: 1,
            name: "Dr. Manoj",
            specialty: "General Physician",
            qualification: "MBBS, MD",
            experience: "15+ Years",
            availability: "Mon - Sat: 10:00 AM - 02:00 PM",
            status: "Available",
            phone: "+91 98765 43210",
            email: "manoj.dr@hospital.com",
            image: null
        },
        {
            id: 2,
            name: "Dr. Praveen",
            specialty: "Cardiologist",
            qualification: "MBBS, MD, DM",
            experience: "12+ Years",
            availability: "Mon - Fri: 04:00 PM - 08:00 PM",
            status: "In OPD",
            phone: "+91 98765 43211",
            email: "praveen.dr@hospital.com",
            image: null
        },
        {
            id: 3,
            name: "Dr. K. Kumaran",
            specialty: "Pediatrician",
            qualification: "MBBS, DCH",
            experience: "20+ Years",
            availability: "Mon - Sat: 09:00 AM - 01:00 PM",
            status: "Available",
            phone: "+91 98765 43212",
            email: "kumaran.dr@hospital.com",
            image: null
        },
        {
            id: 4,
            name: "Dr. Sarah Chen",
            specialty: "Dermatologist",
            qualification: "MBBS, MD (Derma)",
            experience: "8+ Years",
            availability: "Tue, Thu, Sat: 02:00 PM - 06:00 PM",
            status: "On Leave",
            phone: "+91 98765 43213",
            email: "chen.dr@hospital.com",
            image: null
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctor Directory</h1>
                        <p className="text-slate-500">List of all consultants and visiting specialists.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search doctors by name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 shadow-sm"
                        />
                    </div>
                </div>

                {/* Directory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-indigo-500">
                            <CardContent className="p-0">
                                <div className="p-6 text-center space-y-4">
                                    {/* Avatar */}
                                    <div className="relative mx-auto w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center">
                                        {doctor.image ? (
                                            <img src={doctor.image} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <Stethoscope className="h-10 w-10 text-indigo-500" />
                                        )}
                                        <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${doctor.status === 'Available' ? 'bg-green-500' :
                                            doctor.status === 'In OPD' ? 'bg-amber-500' : 'bg-slate-400'
                                            }`} title={doctor.status}></span>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                                        <p className="text-sm font-medium text-indigo-600 mb-1">{doctor.specialty}</p>
                                        <p className="text-xs text-slate-500">{doctor.qualification}</p>
                                    </div>

                                    {/* Availability */}
                                    <div className="pt-4 border-t border-slate-100 space-y-2 text-sm text-left">
                                        <div className="flex items-start gap-3 text-slate-600">
                                            <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <span>{doctor.availability}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                            <span>{doctor.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Award className="h-4 w-4 text-slate-400 shrink-0" />
                                            <span>{doctor.experience}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 flex flex-col gap-2 border-t border-slate-200">
                                    <Button
                                        size="sm"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                        onClick={() => navigate('/hospital/appointments')}
                                    >
                                        View Appointment
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full bg-white text-slate-700 hover:text-indigo-600"
                                        onClick={() => navigate(`/reception/doctors/${doctor.id}`, { state: { doctor } })}
                                    >
                                        View Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No doctors found</h3>
                        <p className="text-slate-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </PageTransition >
    );
};

export default DoctorDirectory;
