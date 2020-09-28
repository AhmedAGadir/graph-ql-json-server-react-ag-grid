import React, { FunctionComponent, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  GridApi,
  ColumnApi,
  GridReadyEvent,
  RowNode,
} from "ag-grid-community";
import { IOlympicWinner, IServerSideDatasourceWithCRUD, IFormSubmitHandler } from "./interfaces";
import { createServerSideDatasource } from './Datasource';
import GridOptions from './GridOptions';
import OlympicWinnerForm from "./OlympicWinnerForm";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import "ag-grid-enterprise";
import './App.css';


const App: FunctionComponent = (): React.ReactElement => {
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi>(null);

  const [showForm, setShowForm] = useState<Boolean>(false);
  const [formData, setFormData] = useState<IOlympicWinner>(null);
  const [formSubmitHandler, setFormSubmitHandler] = useState<IFormSubmitHandler>(null);

  const datasource: IServerSideDatasourceWithCRUD = createServerSideDatasource();

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

    params.api.setServerSideDatasource(datasource);
    params.api.sizeColumnsToFit();
  };

  const getSelectedNode = (): RowNode => {
    const selectedNodes: RowNode[] = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert('Select a row first');
      return null;
    }
    const selectedNode: RowNode = gridApi.getSelectedNodes()[0];
    return selectedNode;
  }

  const addRow: IFormSubmitHandler = (data: IOlympicWinner) => {
    datasource
      .createRow(data)
      .then(() => {
        gridApi.purgeServerSideCache();
      })
  }

  const addRowHandler: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    openForm(null, addRow);
  }

  const updateRow: IFormSubmitHandler = (data: IOlympicWinner) => {
    datasource
      .updateRow(data)
      .then(() => {
        gridApi.purgeServerSideCache();
      })
  }


  const updateSelectedRowHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const selectedNode = getSelectedNode();
    if (selectedNode) {
      const selectedRowId: string = selectedNode.id;
      // first query all of the rows data before passing it to the form
      datasource
        .readRow(selectedRowId)
        .then((selectedRow: IOlympicWinner) => {
          openForm(selectedRow, updateRow);
        });
    }
  };

  const deleteSelectedRowHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const selectedNode = getSelectedNode();
    if (selectedNode && window.confirm('Are you sure you want to delete this node?')) {
      const selectedRowId: string = selectedNode.id;
      datasource
        .deleteRow(selectedRowId)
        .then(() => {
          gridApi.purgeServerSideCache();
        });
    }
  }

  const openForm = (data: IOlympicWinner, fn: IFormSubmitHandler) => {
    setFormData(data);
    setFormSubmitHandler(() => fn);
    setShowForm(true);
  }

  const closeForm = () => {
    setShowForm(false);
    setFormSubmitHandler(null);
    setFormData(null);
  }

  const purgeServerSideCacheHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    gridApi.purgeServerSideCache();
  }


  return (
    <div className="container my-4">
      <div className="card my-3">
        <div className="card-header">
          <img src={require("./assets/ag-grid-logo.png")} alt="ag-Grid Logo" />
        </div>
        <div className="card-body">
          <button onClick={addRowHandler} type="button" className="btn btn-secondary mx-2">Create Row</button>
          <button onClick={updateSelectedRowHandler} type="button" className="btn btn-secondary mx-2">Update Selected Row</button>
          <button onClick={deleteSelectedRowHandler} type="button" className="btn btn-secondary mx-2">Delete Selected Row</button>
          | <button onClick={purgeServerSideCacheHandler} type="button" className="btn btn-secondary mx-2">Purge SS Cache</button>
        </div>
      </div>
      <div
        id="myGrid"
        style={{ height: "calc(100vh - 300px)" }}
        className="ag-theme-alpine-dark">
        <AgGridReact
          gridOptions={GridOptions}
          onGridReady={onGridReady}
        />
      </div>
      {showForm ? <OlympicWinnerForm data={formData} submit={formSubmitHandler} hide={closeForm} /> : null}
    </div>
  )
}

export default App;
