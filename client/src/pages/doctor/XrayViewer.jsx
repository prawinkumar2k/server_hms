import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const XrayViewer = () => {
    const { studyId } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudy = async () => {
            try {
                const token = localStorage.getItem('token');
                // Backend DICOM endpoint to get WADO URL and study details
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/dicom/view/${studyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudy(res.data.data);
            } catch (err) {
                console.error('Error fetching DICOM study:', err);
                setError('Failed to load study details or you are unauthorized.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudy();
    }, [studyId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Viewer...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!study) return <div className="p-8 text-center text-slate-500">Study not found.</div>;

    return (
        <div className="flex flex-col h-screen w-full bg-slate-900 text-white">
            <div className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
                <div>
                    <h1 className="text-xl font-semibold mb-1">DICOM X-Ray Viewer</h1>
                    <p className="text-sm text-slate-400">
                        Patient ID: <span className="text-white font-medium">{study.patient_id}</span> |
                        Study UID: <span className="text-white font-medium">{study.study_instance_uid || 'N/A'}</span> |
                        Date: <span className="text-white font-medium">{new Date(study.study_date).toLocaleDateString()}</span>
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 focus:ring-2 focus:ring-slate-500 rounded transition font-medium"
                >
                    Back to Patient Profile
                </button>
            </div>
            <div className="flex-1 w-full bg-black relative">
                {/* Orthanc native WADO viewer or OHIF if configured */}
                {/* Assumes backend provides 'viewerUrl' (e.g., http://localhost:8042/app/explorer.html#study?uuid=...) */}
                {study.viewerUrl ? (
                    <iframe
                        src={study.viewerUrl}
                        className="w-full h-full border-none"
                        title="DICOM Viewer"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        Viewer URL not available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default XrayViewer;
