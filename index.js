const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag')
const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`; 
// For each query, mutation or subscription has a 
// corresponding resolver
const resolvers = {
  Query: {
    sayHi: () => 'Hello, World!'
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});
// Returns a promise, so use then for result obj
server.listen({port: 5000})
  .then( res => {
    console.log(`Server running at ${res.url}`)
  });