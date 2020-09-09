const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInputObjectType
} = require('graphql');

const axios = require('axios');



const OlympicWinnerType = new GraphQLObjectType({
    name: 'OlympicWinner',
    fields: () => ({
        id: { type: GraphQLString },
        athlete: { type: GraphQLString },
        age: { type: GraphQLInt },
        country: { type: GraphQLString },
        year: { type: GraphQLInt },
        date: { type: GraphQLString },
        sport: { type: GraphQLString },
        gold: { type: GraphQLInt },
        silver: { type: GraphQLInt },
        bronze: { type: GraphQLInt },
        total: { type: GraphQLInt },
    })
});

const ResponseType = new GraphQLObjectType({
    name: 'Response',
    fields: () => ({
        lastRow: { type: GraphQLInt },
        rows: { type: new GraphQLList(OlympicWinnerType) },
    })
})

const SortModelType = new GraphQLInputObjectType({
    name: 'SortModel',
    fields: () => ({
        colId: { type: GraphQLString },
        sort: { type: GraphQLString },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getRows: {
            type: ResponseType,
            args: {
                // ** non-nulls are required **
                startRow: { type: GraphQLNonNull(GraphQLInt) },
                endRow: { type: GraphQLNonNull(GraphQLInt) },
                sortModel: { type: new GraphQLList(SortModelType) }
                // filterModel: {}
                // groupKeys: []
                // pivotCols: []
                // pivotMode: false
                // rowGroupCols: []
                // valueCols: []
            },
            resolve(parentValue, args) {
                let endPoint = `http://localhost:3000/olympicWinners?`;

                if (args.sortModel && args.sortModel.length > 0) {
                    const fields = [];
                    const orders = [];
                    args.sortModel.forEach(sM => {
                        fields.push(sM.colId);
                        orders.push(sM.sort)
                    });
                    endPoint += `_sort=${fields.join(',')}&_order=${orders.join(',')}`;
                };

                if (args.sortModel && args.sortModel.length > 0) {
                    endPoint += `&_start=${args.startRow}&_limit=${args.endRow - args.startRow}`;
                } else {
                    endPoint += `&_start=${args.startRow}&_end=${args.endRow}`;
                }

                // if (args.sortModel) {
                //     endPoint += `_sort=${args.sortModel.coId}&_order=${args.sortModel.sort}`;
                // };

                // if (args.sortModel) {
                //     endPoint += `&_start=${args.startRow}&_limit=${args.endRow - args.startRow}`;
                // } else {
                //     endPoint += `&_start=${args.startRow}&_end=${args.endRow}`;
                // }

                return axios.get(endPoint)
                    .then(res => {
                        return {
                            rows: res.data,
                            lastRow: res.headers["x-total-count"]
                        }
                    })
                    .catch(err => console.log(err));
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        updateOlympicWinner: {
            type: OlympicWinnerType,
            args: {
                /* Only the ID is required */
                id: { type: GraphQLNonNull(GraphQLString) },
                athlete: { type: GraphQLString },
                age: { type: GraphQLInt },
                country: { type: GraphQLString },
                year: { type: GraphQLInt },
                date: { type: GraphQLString },
                sport: { type: GraphQLString },
                gold: { type: GraphQLInt },
                silver: { type: GraphQLInt },
                bronze: { type: GraphQLInt },
                total: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/olympicWinners/${args.id}`, args)
                    .then(res => res.data)
                    .catch(err => console.log(err));
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})