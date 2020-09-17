import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import { IServerSideGetRowsParams, IServerSideGetRowsRequest } from 'ag-grid-community';
// @ts-ignore
import { IOlympicWinner, IServerSideDatasourceWithCRUD } from './interfaces';

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache()
});

// startRow
// endRow
// filterModel: {}
// groupKeys: []
// pivotMode: false
// pivotCols: []
// rowGroupCols: []
// sortModel: []
// valueCols: []

export const createServerSideDatasource = function (): IServerSideDatasourceWithCRUD {
    return {
        getRows: function (params: IServerSideGetRowsParams) {
            console.log('Request', params.request)
            let {
                startRow,
                endRow,
                sortModel,
                // filterModel,
                // groupKeys,
                // pivotCols,
                // pivotMode,
                // rowGroupCols,
                // valueCols,
            }: IServerSideGetRowsRequest = params.request;

            sortModel = sortModel.length > 0 ? sortModel : undefined;
            const visibleColumnIds: string[] = params.columnApi.getAllDisplayedColumns().map(col => col.getColId());

            client.query({
                query: gql`
                    query GetRows($startRow: Int!, $endRow: Int!, $sortModel: [SortModel]) {
                        getRows(startRow: $startRow, endRow: $endRow, sortModel: $sortModel) {
                            lastRow
                            rows { 
                                ${visibleColumnIds.join('\n')}
                            }
                        }
                    }
                `,
                variables: {
                    startRow,
                    endRow,
                    sortModel
                }
            })
                .then(res => res.data.getRows)
                .then(({ lastRow, rows }: { lastRow: number, rows: IOlympicWinner[] }) => {
                    console.log('Response', lastRow, rows);
                    params.successCallback(rows, lastRow);
                })
                .catch(err => {
                    console.log('Error', err);
                    params.failCallback();
                });
        },
        deleteRow(id: string): Promise<any> {
            return client.mutate({
                mutation: gql`
                    mutation DeleteRow($id: ID!) {
                        deleteRow(id: $id) {                             
                            id
                            athlete
                            age
                            country
                            year
                            date
                            sport
                            gold
                            silver
                            bronze
                            total
                        }
                    }
                    `,
                variables: {
                    id
                }
            })
                .then(res => {
                    return res.data.deleteRow;
                })
                .catch(err => console.log('err', err));
        },
        fetchRow(id: string): Promise<any> {
            return client.mutate({
                mutation: gql`
                    query FetchRow($id: ID!) {
                        fetchRow(id: $id) {
                            id
                            athlete
                            age
                            country
                            year
                            date
                            sport
                            gold
                            silver
                            bronze
                            total
                        }
                    }
                    `,
                variables: {
                    id
                }
            })
                .then(res => {
                    return res.data.fetchRow;
                })
                .catch(err => console.log('err', err));
        },
        updateRow(data: IOlympicWinner): Promise<any> {
            return client.mutate({
                mutation: gql`
                    mutation UpdateRow($data: OlympicWinnerInput!) {
                        updateRow(data: $data) {  
                                id
                                athlete
                                age
                                country
                                year
                                date
                                sport
                                gold
                                silver
                                bronze
                                total
                        }
                    }
                    `,
                variables: {
                    data
                }
            })
                .then(res => {
                    return res.data.updateRow;
                })
                .catch(err => console.log('err', err));
        }
    };
}