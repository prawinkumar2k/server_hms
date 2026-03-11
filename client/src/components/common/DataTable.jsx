import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Note: CSS imports removed to use various Theme APIs and avoid Error #239
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

const DataTable = ({
    rowData,
    columnDefs,
    loading = false,
    height = '600px',
    onGridReady,
    defaultColDef,
    onRowClicked,
    pagination = true,
    ...rest
}) => {

    // Default Column Properties
    const defaults = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 100,
        ...defaultColDef
    }), [defaultColDef]);

    // Standard Column Types
    const columnTypes = useMemo(() => ({
        alignedRight: {
            headerClass: 'ag-right-aligned-header',
            cellClass: 'text-right'
        },
        alignedCenter: {
            headerClass: 'ag-center-aligned-header',
            cellClass: 'text-center'
        }
    }), []);

    // Selection Configuration (v33+ Object format)
    const rowSelection = useMemo(() => ({
        mode: 'singleRow',
        checkboxes: false,
        enableClickSelection: true
    }), []);

    return (
        <div style={{ height: height, width: '100%' }}>
            <AgGridReact
                theme={themeQuartz}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaults}
                columnTypes={columnTypes}
                pagination={pagination}
                paginationPageSize={20}
                paginationPageSizeSelector={[20, 50, 100, 500]}
                overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading Data...</span>'}
                overlayNoRowsTemplate={'<span class="ag-overlay-loading-center">No Rows To Show</span>'}
                onGridReady={onGridReady}
                rowSelection={rowSelection}
                onRowClicked={onRowClicked}
                animateRows={true}
                loading={loading}
                {...rest}
            />
        </div>
    );
};

export default DataTable;
