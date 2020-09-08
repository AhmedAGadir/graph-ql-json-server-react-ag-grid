const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema.js');
const cors = require('cors');

const app = express();

// Allow cross-origin
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// setting to the environment PORT variable so that if we deploy to Heroku it will listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
})