import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import { IServerSideGetRowsParams, IServerSideGetRowsRequest } from 'ag-grid-community';
// @ts-ignore
import { IOlympicWinner } from './interfaces';

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

export const createServerSideDatasource = function () {
    return {
        getRows: function (params: IServerSideGetRowsParams) {
            console.log('Request', params.request);

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
                    query Rows($startRow: Int!, $endRow: Int!, $sortModel: [SortModel]) {
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
        // updateRow(params) {

        // }
    };
}