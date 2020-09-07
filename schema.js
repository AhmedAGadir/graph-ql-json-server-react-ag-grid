const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql');

const axios = require('axios');

// Hardcoded data 
// const OLYMPIC_ATHLETES = [
//     { "id": "0", "athlete": "Michael Phelps", "age": 23, "country": "United States", "year": 2008, "date": "24/08/2008", "sport": "Swimming", "gold": 8, "silver": 0, "bronze": 0, "total": 8 },
//     { "id": "1", "athlete": "Michael Phelps", "age": 19, "country": "United States", "year": 2004, "date": "29/08/2004", "sport": "Swimming", "gold": 6, "silver": 0, "bronze": 2, "total": 8 },
//     { "id": "2", "athlete": "Michael Phelps", "age": 27, "country": "United States", "year": 2012, "date": "12/08/2012", "sport": "Swimming", "gold": 4, "silver": 2, "bronze": 0, "total": 6 },
//     { "id": "3", "athlete": "Natalie Coughlin", "age": 25, "country": "United States", "year": 2008, "date": "24/08/2008", "sport": "Swimming", "gold": 1, "silver": 2, "bronze": 3, "total": 6 },
//     { "id": "4", "athlete": "Aleksey Nemov", "age": 24, "country": "Russia", "year": 2000, "date": "01/10/2000", "sport": "Gymnastics", "gold": 2, "silver": 1, "bronze": 3, "total": 6 }
// ];

const AthleteType = new GraphQLObjectType({
    name: 'Athlete',
    fields: () => ({
        // id: { type: GraphQLString },
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
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        athletes: {
            type: new GraphQLList(AthleteType),
            args: {
                // ** non-nulls are requires **
                startRow: { type: GraphQLNonNull(GraphQLInt) },
                endRow: { type: GraphQLNonNull(GraphQLInt) },
                // filterModel: {}
                // groupKeys: []
                // pivotCols: []
                // pivotMode: false
                // rowGroupCols: []
                // sortModel: []
                // valueCols: []
            },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/athletes?_start=${args.startRow}&_end=${args.endRow}`)
                    .then(res => res.data)
                    .catch(err => console.log(err));
            }
        },


    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})