import { IServerSideDatasource } from 'ag-grid-community';

export interface IOlympicWinner {
    id: string,
    athlete: string,
    age: number,
    country: string,
    year: number,
    date: string,
    sport: string,
    gold: number,
    silver: number,
    bronze: number,
    total: number
}

export interface IServerSideDatasourceWithCRUD extends IServerSideDatasource {
    createRow(data: IOlympicWinner): Promise<any>,
    readRow(id: string): Promise<any>,
    updateRow(data: IOlympicWinner): Promise<any>
    deleteRow(id: string): Promise<any>,
}

export interface IFormSubmitHandler {
    (data: IOlympicWinner): void;
}