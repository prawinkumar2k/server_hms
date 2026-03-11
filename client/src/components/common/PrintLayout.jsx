import React from 'react';

const PrintLayout = ({ children, patientDetails, className = "hidden print:block" }) => {
    return (
        <div className={`print-layout w-full max-w-[210mm] mx-auto bg-white text-slate-900 font-sans p-2 ${className}`}>
            {/* Header */}
            <div className="mb-2 relative">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="border-2 border-blue-900 inline-block p-1">
                            <h1 className="text-3xl font-bold text-blue-900 tracking-wider">MITHREN'S HOSPITAL</h1>
                        </div>
                        <p className="text-xs font-bold mt-1 text-slate-700">123, Health Avenue, Medical City, State - 600001</p>
                        <p className="text-xs text-slate-600">Ph: 044-12345678, 9876543210 | Email: contact@mithrenhospital.com</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-blue-900 text-sm">Dr. SARAH WILSON</p>
                        <p className="text-xs text-slate-600">M.B.B.S, M.D (General Medicine)</p>
                        <p className="text-xs text-slate-600">Reg No: 123456</p>
                    </div>
                </div>
            </div>

            {/* Blue Separator */}
            <div className="h-[2px] bg-blue-800 w-full mb-2"></div>

            {/* Patient Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 text-sm font-bold text-slate-900 mb-2 leading-snug px-2">
                <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-blue-900">Name</span>
                    <span>: {patientDetails?.name || '-'}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-blue-900">Date</span>
                    <span>: {patientDetails?.reportDate || new Date().toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-blue-900">Age / Sex</span>
                    <span>: {patientDetails?.age || '-'} / {patientDetails?.sex || '-'}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-blue-900">Ref. By</span>
                    <span>: {patientDetails?.refBy || 'Self'}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                    <span className="text-blue-900">Patient ID</span>
                    <span>: {patientDetails?.patientId || '-'}</span>
                </div>
            </div>

            {/* Blue Separator */}
            <div className="h-[2px] bg-blue-800 w-full mb-4"></div>

            {/* Main Content Area */}
            <div className="min-h-[500px]">
                {children}
            </div>

            {/* Footer Signatures */}
            <div className="mt-8 pt-16 flex justify-between items-end text-sm font-bold text-slate-800 px-8">
                <div className="text-center">
                    <p className="border-t border-slate-400 px-4 pt-1">Lab Technician</p>
                </div>
                <div className="text-center">
                    <p className="border-t border-slate-400 px-4 pt-1">Consultant Pathologist</p>
                </div>
            </div>

            <div className="mt-4 text-[10px] text-center text-slate-400 border-t border-slate-200 pt-2">
                This is a computer generated report and does not require a physical signature.
            </div>
        </div>
    );
};

export default PrintLayout;
