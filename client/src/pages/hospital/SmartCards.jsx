import React, { useState, useEffect } from 'react';
import { Search, Printer, UserSquare2, QrCode } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { usePatients } from '../../context/PatientContext';

const SmartCards = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    const { patients: realPatients, loading: contextLoading } = usePatients();

    useEffect(() => {
        if (!contextLoading) {
            setPatients(realPatients);
            setLoading(false);
        }
    }, [realPatients, contextLoading]);

    const filteredPatients = patients.filter(p =>
        (p?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p?.id?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        // Native print of the modal content
        window.print();
    };

    return (
        <PageTransition>
            <div className="space-y-6 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Patient Smart Cards</h1>
                        <p className="text-slate-500">Generate and print patient identification cards.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* List Section */}
                    <div className="flex-1 space-y-4 print:hidden">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            {filteredPatients.map(p => (
                                <div key={p.id}
                                    onClick={() => setSelectedPatient(p)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPatient?.id === p.id ? 'bg-blue-50 border-blue-500Ring ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-slate-800">{p.name}</div>
                                            <div className="text-xs text-slate-500">{p.id} • {p.gender}, {p.age}y</div>
                                        </div>
                                        <UserSquare2 className="h-5 w-5 text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:w-[450px] shrink-0">
                        {selectedPatient ? (
                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0" id="smart-card-area">
                                    {/* Smart Card Design */}
                                    <div className="w-[350px] h-[220px] mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-2xl relative text-white print:w-[350px] print:h-[220px] print:shadow-none print:border">
                                        {/* Background Design */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8 blur-lg"></div>

                                        {/* Content */}
                                        <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg tracking-wide">HMS HOSPITAL</h3>
                                                    <p className="text-[10px] text-blue-100 uppercase tracking-wider">Patient Identity Card</p>
                                                </div>
                                                <div className="bg-white p-1 rounded-lg">
                                                    {/* QR Code Placeholder using API for simplicity/demo */}
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedPatient.id}`}
                                                        alt="QR"
                                                        className="h-12 w-12"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 items-center mt-2">
                                                {selectedPatient.photo ? (
                                                    <img
                                                        src={`/api/patients/${selectedPatient.id}/photo?t=${selectedPatient.photo}&token=${localStorage.getItem('token')}`}
                                                        alt={selectedPatient.name}
                                                        className="h-16 w-16 rounded-lg object-cover border border-white/40"
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="h-16 w-16 bg-blue-900/50 rounded-lg flex items-center justify-center border border-white/20"
                                                    style={{ display: selectedPatient.photo ? 'none' : 'flex' }}
                                                >
                                                    <span className="text-2xl">{selectedPatient.name?.charAt(0) || 'P'}</span>
                                                </div>
                                                <div>
                                                    <h2 className="font-bold text-xl leading-tight">{selectedPatient.name}</h2>
                                                    <p className="text-xs text-blue-100 mt-1">ID: {selectedPatient.id}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                                                <div>
                                                    <p className="text-[9px] text-blue-200 uppercase">Blood Group</p>
                                                    <p className="font-bold text-sm">{selectedPatient.bloodGroup || selectedPatient.blood || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-blue-200 uppercase">Emergency</p>
                                                    <p className="font-bold text-sm">{selectedPatient.mobile || selectedPatient.phone || 'N/A'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-blue-200 uppercase">DOB / Age</p>
                                                    <p className="font-bold text-sm">{selectedPatient.age} Yrs</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 hidden print:block text-center text-xs text-slate-400">
                                        Generated by HMS System on {new Date().toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex justify-center print:hidden">
                                    <Button onClick={handlePrint} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg w-full max-w-[350px]">
                                        <Printer className="h-4 w-4 mr-2" /> Print / Download PDF
                                    </Button>
                                </div>
                                <p className="text-center text-xs text-slate-400 print:hidden">
                                    Use browser print to Save as PDF
                                </p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-10 bg-slate-50 min-h-[300px]">
                                <UserSquare2 className="h-12 w-12 mb-3 text-slate-300" />
                                <p>Select a patient to generate card</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #smart-card-area, #smart-card-area * {
                        visibility: visible;
                    }
                    #smart-card-area {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: none;
                        box-shadow: none;
                    }
                }
            `}</style>
        </PageTransition>
    );
};

export default SmartCards;
