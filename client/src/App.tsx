import React, { FunctionComponent, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  GridApi,
  ColumnApi,
  GridReadyEvent,
  ColDef,
  SideBarDef,
  ColumnVisibleEvent,
  SortChangedEvent,
  CellEditingStoppedEvent,
  RowNode
} from "ag-grid-community";

import { IOlympicWinner, IServerSideDatasourceWithCRUD } from "./interfaces";
import { createServerSideDatasource } from './Datasource';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import "ag-grid-enterprise";
import './App.css';

// import axios from "axios";


const App: FunctionComponent = (): React.ReactElement => {
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi>(null);

  const datasource: IServerSideDatasourceWithCRUD = createServerSideDatasource();

  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', editable: false, maxWidth: 100 },
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
    // editable: true,
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

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

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

  const updateSelectedRow = () => {
    const selectedNodes: RowNode[] = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert('Select a row first');
      return;
    }
    const selectedRow: RowNode = selectedNodes[0].data;

    const updatedRow: IOlympicWinner = {
      id: selectedRow.id,
      athlete: 'Ahmed Gadir',
      age: 26,
      country: 'United Kingdom',
      year: 2020,
      date: '11/09/2020',
      sport: 'Brazilian Jiu Jitsu',
      gold: 10,
      silver: 0,
      bronze: 0,
      total: 10
    }

    datasource
      .updateRow(
        updatedRow.id,
        updatedRow.athlete,
        updatedRow.age,
        updatedRow.country,
        updatedRow.year,
        updatedRow.date,
        updatedRow.sport,
        updatedRow.gold,
        updatedRow.silver,
        updatedRow.bronze,
        updatedRow.total)
      .then((res) => {
        gridApi.purgeServerSideCache();
      })
      .catch((err: Error) => console.log('error', err));
  };

  const deleteSelectedRow = () => {
    const selectedNodes: RowNode[] = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert('Select a row first');
      return;
    }
    const selectedRowId: string = selectedNodes[0].id;

    datasource
      .deleteRow(selectedRowId)
      .then(() => {
        gridApi.purgeServerSideCache();
      })
      .catch((err: Error) => {
        console.log('Error', err);
      });
  }

  return (
    <div className="container my-4">
      <h3>ag-Grid Server Side Row Model + GraphQL + Apollo + JSON Server</h3>
      <div className="card my-3">
        <div className="card-body">
          <button onClick={updateSelectedRow} type="button" className="btn btn-secondary mx-2">Update Selected Row</button>
          <button onClick={deleteSelectedRow} type="button" className="btn btn-secondary mx-2">Delete Selected Row</button>
          <button onClick={() => { gridApi.purgeServerSideCache() }} type="button" className="btn btn-secondary mx-2">Purge SS Cache</button>
        </div>
      </div>
      <div
        id="myGrid"
        style={{ height: "calc(100vh - 250px)" }}
        className="ag-theme-alpine-dark">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="serverSide"
          onGridReady={onGridReady}
          onColumnVisible={onColumnVisible}
          onSortChanged={onSortChanged}
          // onCellEditingStopped={onCellEditingStopped}
          // editType="fullRow"
          sideBar={sideBar}
          rowSelection="single"
          getRowNodeId={getRowNodeId}
        />
      </div>
    </div>
  )
}

export default App;
