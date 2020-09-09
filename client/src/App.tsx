import React, { FunctionComponent, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridApi, ColumnApi, GridReadyEvent, ColDef, SideBarDef, ColumnVisibleEvent, SortChangedEvent, CellEditingStoppedEvent } from "ag-grid-community";

// @ts-ignore
import { createServerSideDatasource } from './Datasource.ts';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import "ag-grid-enterprise";
import './App.css';


// import axios from "axios

const App: FunctionComponent = (): React.ReactElement => {
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi>(null);

  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age", hide: true, },
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
    editable: true
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

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

    const datasource = createServerSideDatasource();
    params.api.setServerSideDatasource(datasource);

    params.api.sizeColumnsToFit();
  }

  const onColumnVisible = (params: ColumnVisibleEvent) => {
    params.api.sizeColumnsToFit();
    params.api.purgeServerSideCache();
  }

  const onSortChanged = (params: SortChangedEvent) => {
    params.api.purgeServerSideCache();
  }

  const onCellEditingStopped = (params: CellEditingStoppedEvent) => {
    console.log('onCellEditingStopped')
    debugger;
    // this.gridApi.serverSideRowModel.datasource.updateRow({
    //   id: params.node.id,
    //   field: params.column.colId,
    //   value: params.value
    // });
    // params.api.purgeServerSideCache();
  }


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        id="myGrid"
        style={{ height: "100%", width: "100%" }}
        className="ag-theme-alpine-dark">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="serverSide"
          onGridReady={onGridReady}
          onColumnVisible={onColumnVisible}
          onSortChanged={onSortChanged}
          onCellEditingStopped={onCellEditingStopped}
          // editType="fullRow"
          sideBar={sideBar}
        />
      </div>
    </div>
  )
}

export default App;
