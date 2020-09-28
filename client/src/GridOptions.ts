import {
    ColDef,
    SideBarDef,
    ColumnVisibleEvent,
    SortChangedEvent,
} from "ag-grid-community";
import { IOlympicWinner } from './interfaces';

const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age", hide: true },
    { field: "country" },
    { field: "year" },
    { field: "date", hide: true },
    { field: "sport" },
    { field: "gold", hide: true },
    { field: "silver", hide: true },
    { field: "bronze", hide: true },
    { field: "total", hide: true }
];

const defaultColDef: ColDef = {
    sortable: true,
    resizable: true
}

const sideBar: SideBarDef = {
    toolPanels: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
                suppressSideButtons: true,
                suppressColumnFilter: true,
                suppressColumnSelectAll: true,
                suppressColumnExpandAll: true,
            },
        },
    ],
    defaultToolPanel: 'columns',
}

const getRowNodeId = (data: IOlympicWinner) => data.id;


const onColumnVisible = (params: ColumnVisibleEvent) => {
    params.api.sizeColumnsToFit();
    params.api.purgeServerSideCache();
}

const onSortChanged = (params: SortChangedEvent) => {
    params.api.purgeServerSideCache();
}

const rowSelection = "single";

const rowModelType = "serverSide";

export default {
    columnDefs,
    defaultColDef,
    sideBar,
    getRowNodeId,
    onColumnVisible,
    onSortChanged,
    rowModelType,
    rowSelection
}