
import React, { useState } from 'react';
import { Search, Save, FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import PageTransition from '../../components/layout/PageTransition';

const LabEntry = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <FileText className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Result Entry</h1>
                    <p className="text-slate-500 text-sm">Record and validate test results</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Patient Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Patient ID / Name</label>
                            <Input placeholder="Search patient..." />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Patient Name:</span>
                                <span className="font-medium">John Doe</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Age / Gender:</span>
                                <span className="font-medium">45 / Male</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Referred By:</span>
                                <span className="font-medium">Dr. Wilson</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Select Test</label>
                            <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>Complete Blood Count (CBC)</option>
                                <option>Lipid Profile</option>
                                <option>Blood Sugar (Fasting)</option>
                            </select>
                        </div>

                        <Button className="w-full">Load Template</Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Result Entry Form</CardTitle>
                        <Badge variant="warning">Status: Pending Review</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-50 font-medium text-sm text-slate-700 rounded-lg">
                                <div>Parameter</div>
                                <div>Observed Value</div>
                                <div>Reference Range</div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm font-medium text-slate-700">Hemoglobin</label>
                                    <Input placeholder="Enter value" />
                                    <span className="text-sm text-slate-500">13.0 - 17.0 g/dL</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm font-medium text-slate-700">RBC Count</label>
                                    <Input placeholder="Enter value" />
                                    <span className="text-sm text-slate-500">4.5 - 5.5 M/uL</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm font-medium text-slate-700">WBC Count</label>
                                    <Input placeholder="Enter value" />
                                    <span className="text-sm text-slate-500">4.0 - 11.0 K/uL</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm font-medium text-slate-700">Platelets</label>
                                    <Input placeholder="Enter value" />
                                    <span className="text-sm text-slate-500">150 - 450 K/uL</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                <label className="text-sm font-medium text-slate-700">Remarks / Clinical Notes</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter any additional notes..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="ghost">Cancel</Button>
                                <Button className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Submit Results
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LabEntry;
