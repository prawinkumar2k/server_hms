import React, { useState, useEffect } from 'react';
import { Search, Printer, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import PageTransition from '../../components/layout/PageTransition';

import { useLocation } from 'react-router-dom';

const TestReport = () => {
    const location = useLocation();
    const [filters, setFilters] = useState({
        testId: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        patientId: '' // Added patientId support
    });

    const [reports, setReports] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Auto-search on mount if passed state
    useEffect(() => {
        // Fetch suggestions (recent test IDs)
        const fetchSuggestions = async () => {
            try {
                // Fetch recent 50 entries for suggestion
                const res = await fetch('/api/lab/test-entry');
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.map(item => ({ id: item.id, name: item.patientName })));
                }
            } catch (e) { console.error("Error fetching suggestions", e); }
        };
        fetchSuggestions();

        if (location.state?.searchCoords) {
            const { patientId, testId } = location.state.searchCoords;
            const updatedFilters = {
                ...filters,
                patientId: patientId || '',
                testId: testId || '' // Use passed TestID if available
            };
            setFilters(updatedFilters);
            fetchReports(updatedFilters);
        }
    }, [location.state]);

    const fetchReports = async (currentFilters) => {
        try {
            const query = new URLSearchParams(currentFilters).toString();
            const res = await fetch(`/api/lab/test-entry?${query}`);
            const data = await res.json();
            setReports(data);
        } catch (e) { console.error(e); }
    };

    const handleSearch = () => fetchReports(filters);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                        <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Test Reports</h1>
                        <p className="text-slate-500">View and print patient test reports.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                    {/* Left Filter Actions */}
                    <Card className="lg:col-span-1 shadow-md border-primary-100 h-full">
                        <CardHeader className="bg-primary-50/50 border-b border-primary-100 p-4">
                            <CardTitle className="text-sm text-primary-900 font-semibold">Report Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Test ID</label>
                                <div className="flex gap-2">
                                    <input
                                        className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                        value={filters.testId}
                                        onChange={(e) => setFilters({ ...filters, testId: e.target.value })}
                                        placeholder="Enter or Select ID"
                                        list="test-id-suggestions"
                                    />
                                    <datalist id="test-id-suggestions">
                                        {suggestions.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.id} - {s.name}
                                            </option>
                                        ))}
                                    </datalist>
                                    <Button size="icon" onClick={handleSearch} className="bg-primary-600 hover:bg-primary-700 text-white"><Search className="h-4 w-4" /></Button>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase">Date Range</h4>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">From Date</label>
                                    <input
                                        type="date"
                                        className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                        value={filters.fromDate}
                                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">To Date</label>
                                    <input
                                        type="date"
                                        className="w-full h-10 rounded-lg border-slate-300 text-sm"
                                        value={filters.toDate}
                                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                                    />
                                </div>
                                <Button className="w-full bg-slate-800 text-white" onClick={handleSearch}>
                                    <Search className="h-4 w-4 mr-2" /> Search Reports
                                </Button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                                <Button variant="outline" className="w-full justify-start text-slate-600">
                                    <FileText className="h-4 w-4 mr-2" /> Blank Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-slate-600">
                                    <Download className="h-4 w-4 mr-2" /> Export to Excel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Report Viewer */}
                    <Card className="lg:col-span-3 shadow-md border-slate-200 h-full bg-slate-50 flex flex-col">
                        <CardHeader className="bg-white border-b border-slate-100 p-4 flex flex-row justify-between items-center">
                            <CardTitle className="text-sm text-slate-600">Report Preview</CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost">Zoom In</Button>
                                <Button size="sm" variant="ghost">Zoom Out</Button>
                                <Button size="sm" className="bg-slate-900 text-white"><Printer className="h-4 w-4 mr-2" /> Print</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-8 overflow-y-auto flex items-start justify-center">
                            {reports.length > 0 ? (
                                <div className="w-full bg-white shadow-sm border border-slate-200 min-h-[600px] p-10">
                                    {/* Mock PDF View */}
                                    <div className="text-center border-b pb-4 mb-4">
                                        <h2 className="text-xl font-bold text-slate-900">KUMARAN CLINIC</h2>
                                        <p className="text-sm text-slate-500">123, Main Street, City</p>
                                    </div>
                                    <table className="w-full text-sm mb-6">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 font-bold text-slate-500 w-32">Patient Name:</td>
                                                <td>{reports[0].patientName}</td>
                                                <td className="py-1 font-bold text-slate-500 w-32">Date:</td>
                                                <td>{reports[0].testDate ? new Date(reports[0].testDate).toLocaleDateString() : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 font-bold text-slate-500">Age / Sex:</td>
                                                <td>{reports[0].age} / {reports[0].sex}</td>
                                                <td className="py-1 font-bold text-slate-500">Ref Doctor:</td>
                                                <td>{reports[0].refDoctor}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 font-bold text-slate-500">Test ID:</td>
                                                <td className="font-mono font-bold text-slate-800">{reports[0].id || reports[0].testId}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="border rounded-lg p-4 bg-slate-50">
                                        <h3 className="font-bold border-b pb-2 mb-2">Test Results</h3>
                                        {reports.map((r, i) => (
                                            <div key={i} className="flex justify-between py-2 border-b border-dashed last:border-0 border-slate-200">
                                                <span>{r.testName}</span>
                                                <span className="font-mono">Negative</span> {/* Mock Result */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 mt-20">
                                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                    <p>Select filters and search to view reports</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageTransition>
    );
};

export default TestReport;
