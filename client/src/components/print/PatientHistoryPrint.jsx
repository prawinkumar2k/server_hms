import React from 'react';
import BillLogo from '../../assets/bill_logo.svg';

const PatientHistoryPrint = ({ data, searchQuery }) => {
    // If no data, render nothing (or a safe fallback structure for preview)
    if (!data && !searchQuery) return null;

    // Use current date as 'Date' if not provided
    const currentDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format preference

    const patientDetails = {
        id: data?.patientId || '',
        name: data?.patientName || searchQuery || '',
        ageSex: data?.age ? `${data.age} / ${data.gender || ''}` : '',
        mobile: data?.mobile || '',
        bloodGroup: data?.bloodGroup || '',
        temp: data?.temp || '',
        bp: data?.bp || '',
        date: data?.date || currentDate
    };

    const prescriptions = data?.prescriptions || [];

    return (
        <div id="patient-history-print" className="printable-content bg-white text-black font-sans p-8 mx-auto w-[210mm] min-h-[297mm] shadow-lg print:shadow-none mb-10">
            <div className="flex flex-col h-full relative">
                {/* --- HEADER SECTION --- */}
                <div className="relative mb-6">
                    {/* Phone Top Right */}
                    <div className="absolute top-0 right-0 text-right">
                        <p className="text-blue-900 font-bold text-sm">Ph: +91-95009 79113</p>
                    </div>

                    {/* Logo Left - Using placeholder SVG for consistency with DailyOP */}
                    <div className="w-24 h-24 flex items-center justify-center">
                        {/* Placeholder for the blue Winged Caduceus logo */}
                        <div className="relative w-20 h-20">
                            <img src={BillLogo} className="w-full h-full object-contain" alt="Hospital Logo" />
                        </div>
                    </div>

                    {/* Hospital Name Box */}
                    <div className="flex flex-col items-center justify-center pt-8">
                        <div className="border-2 border-blue-900 px-6 py-2 mb-1">
                            <h1 className="text-3xl font-bold text-blue-900 uppercase tracking-wide">MITHREN'S HOSPITAL</h1>
                        </div>
                        <p className="text-blue-900 font-medium text-sm mb-2">ERODE- 637408.</p>

                        <div className="text-center text-blue-900 text-sm font-medium leading-tight">
                            <p>Dr. Mithren, M.B.B.S., M.S., FMAS, FIAGES, FALS.,</p>
                            <p>Consultant General & Laparoscopic Surgeon</p>
                        </div>
                    </div>

                    {/* Separator Line */}
                    <div className="w-full h-0.5 bg-blue-900 mt-4"></div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-red-900 uppercase tracking-wider">PATIENT HISTORY</h2>
                </div>

                {/* --- PATIENT DETAILS GRID --- */}
                <div className="grid grid-cols-2 gap-x-20 gap-y-6 mb-8 px-2">
                    {/* Left Col */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-24">ID :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.id}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-24">NAME :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.name}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-24">AGE / SEX :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.ageSex}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-24">MOBILE NO :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.mobile}</span>
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-6 pl-8">
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-32">BLOOD GROUP :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.bloodGroup}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-32">TEMP :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.temp}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-32">BP :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.bp}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-red-900 w-32">DATE :</span>
                            <span className="font-bold text-blue-900 uppercase flex-1">{patientDetails.date}</span>
                        </div>
                    </div>
                </div>

                {/* --- REMARKS BOX --- */}
                <div className="border border-black p-3 min-h-[50px] mb-8 mx-0 relative">
                    <span className="font-bold text-red-900 absolute top-3 left-3">REMARKS :</span>
                    <p className="ml-28 mt-0.5 font-bold text-blue-900 uppercase">{data?.remarks || ''}</p>
                </div>

                {/* --- PRESCRIPTION TABLE --- */}
                <div className="mb-4">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-t-2 border-b-2 border-black text-red-900 font-bold">
                                <th className="py-2 px-2 text-left w-1/3 border-black">Tablet</th>
                                <th className="py-2 px-2 text-center border-black">Morn</th>
                                <th className="py-2 px-2 text-center border-black">Noon</th>
                                <th className="py-2 px-2 text-center border-black">Night</th>
                                <th className="py-2 px-2 text-center border-black">Qty</th>
                                <th className="py-2 px-2 text-center border-black">Food</th>
                                <th className="py-2 px-2 text-center border-black">No of Days</th>
                            </tr>
                        </thead>
                        <tbody className="text-blue-900 font-bold">
                            {/* Rows or Empty Lines */}
                            {prescriptions.length > 0 ? prescriptions.map((rx, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td className="py-2 px-2 text-left">{rx.tablet || rx.medicineName}</td>
                                    <td className="py-2 px-2 text-center">{rx.morn}</td>
                                    <td className="py-2 px-2 text-center">{rx.noon}</td>
                                    <td className="py-2 px-2 text-center">{rx.night}</td>
                                    <td className="py-2 px-2 text-center">{rx.qty}</td>
                                    <td className="py-2 px-2 text-center">{rx.food}</td>
                                    <td className="py-2 px-2 text-center">{rx.days}</td>
                                </tr>
                            )) : (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="h-8 border-b border-gray-100">
                                        <td colSpan="7"></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Bottom Border for Table if needed, technically header has bottom border so maybe not strict */}
                    <div className="border-t-2 border-black mt-0"></div>
                </div>

            </div>
        </div>
    );
};

export default PatientHistoryPrint;
