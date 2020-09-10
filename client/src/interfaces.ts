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
    deleteRow(id: string): Promise<IOlympicWinner>
}