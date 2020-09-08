const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');

const axios = require('axios');



const OlympicWinnersType = new GraphQLObjectType({
    name: 'OlympicWinners',
    fields: () => ({
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
        rows: { type: new GraphQLList(OlympicWinnersType) },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getRows: {
            type: ResponseType,
            args: {
                // ** non-nulls are required **
                startRow: { type: GraphQLNonNull(GraphQLInt) },
                endRow: { type: GraphQLNonNull(GraphQLInt) },
                // sortModel: []
                // filterModel: {}
                // groupKeys: []
                // pivotCols: []
                // pivotMode: false
                // rowGroupCols: []
                // valueCols: []
            },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/olympicWinners?_start=${args.startRow}&_end=${args.endRow}`)
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
})


module.exports = new GraphQLSchema({
    query: RootQuery
})