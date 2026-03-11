import React, { useState, useEffect, useRef } from 'react';
import { Search, Printer, FileText, Download, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const ReportViewModal = ({ reportId, onClose }) => {
    const [htmlContent, setHtmlContent] = useState('');
    // const reportRef = useRef(null); // Not used in iframe approach
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/lab/test-entry/${reportId}/print?mode=view`);
                const html = await res.text();
                // Strip remote scripts to be safe, though React usually blocks them
                setHtmlContent(html);
            } catch (err) {
                console.error("Failed to load report", err);
            }
        };
        if (reportId) fetchReport();
    }, [reportId]);

    const handleDownloadPdf = async () => {
        if (downloading) return;
        setDownloading(true);

        try {
            const response = await fetch(`/api/lab/test-entry/${reportId}/download`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LabReport_${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("PDF Download failed:", err);
            alert("Download failed. Please check server logs.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Report Preview <span className="text-xs font-normal text-slate-400 ml-2">(#{reportId})</span>
                    </h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleDownloadPdf}
                            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
                            disabled={downloading}
                        >
                            <Download className={`h-4 w-4 mr-2 ${downloading ? 'animate-bounce' : ''}`} />
                            {downloading ? 'Processing...' : 'Download PDF'}
                        </Button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Preview Area (Visual Only) */}
                <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center">
                    <div className="bg-white shadow-lg w-[210mm] min-h-[297mm] h-fit shrink-0 p-0 origin-top">
                        <div
                            className="w-full h-full bg-white"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TestReport = () => {
    const location = useLocation();
    const [filters, setFilters] = useState({
        testId: '',
        patientId: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
    });

    const [reports, setReports] = useState([]);
    const [viewingReportId, setViewingReportId] = useState(null);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/lab/test-entry');
            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        } catch (e) {
            console.error("Failed to load reports", e);
        }
    };

    // Initial Load & Query Logic
    useEffect(() => {
        fetchReports();
    }, []);

    // Handle incoming navigation state (e.g. from Doctor's Lab Results)
    useEffect(() => {
        if (location.state?.searchCoords?.testId) {
            setViewingReportId(location.state.searchCoords.testId);

            // Optional: Set filter to show this report in the background list
            setFilters(prev => ({
                ...prev,
                testId: String(location.state.searchCoords.testId)
            }));
        }
    }, [location.state]);

    const handleViewReport = (report) => {
        setViewingReportId(report.id);
    };

    // Filter Logic
    const filteredReports = reports.filter(r => {
        const search = filters.testId.toLowerCase();

        // Date Check
        const reportDate = new Date(r.testDate);
        const fromDate = new Date(filters.fromDate);
        const toDate = new Date(filters.toDate);
        // Set toDate to end of day to include records on that day
        toDate.setHours(23, 59, 59, 999);
        // Set fromDate to start of day
        fromDate.setHours(0, 0, 0, 0);

        const isDateInRange = (!filters.fromDate || !filters.toDate) || (reportDate >= fromDate && reportDate <= toDate);

        // Text Search Check
        const isTextMatch = (
            (r.patientName && r.patientName.toLowerCase().includes(search)) ||
            (r.testName && r.testName.toLowerCase().includes(search)) ||
            (String(r.id).includes(search))
        );

        return isDateInRange && isTextMatch;
    });

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Reports</h1>
                        <p className="text-slate-500">View, print, and download patient test reports.</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    className="w-full pl-9 h-10 rounded-lg border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search by patient or test..."
                                    value={filters.testId}
                                    onChange={e => setFilters({ ...filters, testId: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    className="h-10 rounded-lg border-slate-200 text-sm"
                                    value={filters.fromDate}
                                    onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
                                />
                                <span className="text-slate-400">-</span>
                                <input
                                    type="date"
                                    className="h-10 rounded-lg border-slate-200 text-sm"
                                    value={filters.toDate}
                                    onChange={e => setFilters({ ...filters, toDate: e.target.value })}
                                />
                                <Button className="bg-slate-900 text-white" onClick={() => fetchReports()}>
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Recent Reports</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Report ID</th>
                                    <th className="p-4">Patient</th>
                                    <th className="p-4">Test Name</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400">No reports found matching criteria.</td>
                                    </tr>
                                ) : (
                                    filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-slate-600">#{report.id}</td>
                                            <td className="p-4 font-medium text-slate-900">{report.patientName}</td>
                                            <td className="p-4 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span>{report.testName}</span>
                                                    <span className="text-xs text-slate-400">{report.subTestName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {report.testDate ? new Date(report.testDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    COMPLETED
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    onClick={() => handleViewReport(report)}
                                                >
                                                    <FileText className="h-4 w-4" /> View Report
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* View Modal */}
            {viewingReportId && <ReportViewModal reportId={viewingReportId} onClose={() => setViewingReportId(null)} />}
        </PageTransition>
    );
};

export default TestReport;
