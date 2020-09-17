import React, { FunctionComponent, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  GridApi,
  ColumnApi,
  GridReadyEvent,
  RowNode
} from "ag-grid-community";
import { IOlympicWinner, IServerSideDatasourceWithCRUD } from "./interfaces";
import { createServerSideDatasource } from './Datasource';
import GridOptions from './GridOptions';
import UpdateOlympicWinnerForm from "./UpdateOlympicWinnerForm";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import "ag-grid-enterprise";
import './App.css';


const App: FunctionComponent = (): React.ReactElement => {
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [formData, setFormData] = useState<IOlympicWinner>(null);

  const datasource: IServerSideDatasourceWithCRUD = createServerSideDatasource();

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.setServerSideDatasource(datasource);
    params.api.sizeColumnsToFit();
  }

  const getSelectedNode = (): RowNode => {
    const selectedNodes: RowNode[] = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert('Select a row first');
      return null;
    }
    const selectedNode: RowNode = gridApi.getSelectedNodes()[0];
    return selectedNode;
  }

  const deleteSelectedRowHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const selectedNode = getSelectedNode();

    if (selectedNode) {
      const selectedRowId: string = selectedNode.id;

      datasource
        .deleteRow(selectedRowId)
        .then(() => {
          gridApi.purgeServerSideCache();
        });
    }
  }

  const updateSelectedRowHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const selectedNode = getSelectedNode();

    if (selectedNode) {
      const selectedRowId: string = selectedNode.id;

      datasource
        .fetchRow(selectedRowId)
        .then((selectedRow: IOlympicWinner) => {
          openForm(selectedRow);
        });
    }
  };

  const updateRow = (data: IOlympicWinner) => {
    datasource
      .updateRow(data)
      .then(() => {
        gridApi.purgeServerSideCache();
      })
  }

  const purgeServerSideCacheHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    gridApi.purgeServerSideCache();
  }

  const openForm = (data: IOlympicWinner) => {
    setFormData(data);
    setShowForm(true);
  }

  const closeForm = () => {
    setShowForm(false);
    setFormData(null);
  }

  return (
    <div className="container my-4">
      <h3>ag-Grid Server Side Row Model + GraphQL + Apollo + JSON Server</h3>
      <div className="card my-3">
        <div className="card-body">
          <button onClick={updateSelectedRowHandler} type="button" className="btn btn-secondary mx-2">Update Selected Row</button>
          <button onClick={deleteSelectedRowHandler} type="button" className="btn btn-secondary mx-2">Delete Selected Row</button>
          <button onClick={purgeServerSideCacheHandler} type="button" className="btn btn-secondary mx-2">Purge SS Cache</button>
        </div>
      </div>
      <div
        id="myGrid"
        style={{ height: "calc(100vh - 250px)" }}
        className="ag-theme-alpine-dark">
        <AgGridReact
          columnDefs={GridOptions.columnDefs}
          defaultColDef={GridOptions.defaultColDef}
          getRowNodeId={GridOptions.getRowNodeId}
          sideBar={GridOptions.sideBar}
          onColumnVisible={GridOptions.onColumnVisible}
          onSortChanged={GridOptions.onSortChanged}
          rowModelType={GridOptions.rowModelType}
          rowSelection={GridOptions.rowSelection}
          onGridReady={onGridReady}
        />
      </div>
      {showForm ? <UpdateOlympicWinnerForm data={formData} submit={updateRow} onHide={closeForm} /> : null}
    </div>
  )
}

export default App;
