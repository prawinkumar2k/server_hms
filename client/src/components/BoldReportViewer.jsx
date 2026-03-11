/* eslint-disable */
import React, { useEffect, useState } from 'react';

// Bold Reports React Wrapper requires create-react-class to be available globally
import createReactClass from 'create-react-class';

const BoldReportViewer = ({
    reportPath,
    reportServiceUrl = "https://demos.boldreports.com/services/api/ReportViewer",
    dataSources,
    parameters
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Ensure createReactClass and React are available globally for the legacy script
        window.createReactClass = createReactClass;
        window.React = React;

        // Dynamically import the Bold Reports React wrapper to ensure it runs AFTER assignment
        import('@boldreports/react-reporting-components/Scripts/bold.reports.react.min.js')
            .then(() => {
                setIsLoaded(true);
            })
            .catch((error) => {
                console.error("Failed to load Bold Reports script:", error);
            });
    }, []);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-[600px] border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="text-slate-500 font-medium animate-pulse">Initializing Report Viewer...</div>
            </div>
        );
    }

    // The library registers the component on the window object
    const ReportViewer = window.BoldReportViewerComponent;

    if (!ReportViewer) {
        return <div className="text-red-500 p-4">Error: BoldReportViewerComponent not found even after loading.</div>;
    }

    return (
        <div style={{ height: '750px', width: '100%', minHeight: '600px' }} className="bold-report-container">
            <ReportViewer
                id="report-viewer"
                reportPath={reportPath}
                reportServiceUrl={reportServiceUrl}
                dataSources={dataSources}
                parameters={parameters}
                processingMode={dataSources ? 'Local' : 'Remote'}
                toolbarSettings={{
                    showToolbar: true,
                    items: [
                        'Print', 'Export', 'Zoom', 'FitPage', 'FitWidth', 'PageSetup'
                    ]
                }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default BoldReportViewer;
