// Dependency imports
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

// Relative imports
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');

const mongodbUri = ('mongodb+srv://' 
  + process.env.SERVER_USER+':'
  + process.env.SERVER_PASSWORD 
  + '@cluster0.2m67r.mongodb.net/merng?retryWrites=true&w=majority');

  // Returns a promise, so use then for result obj
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`MongoDB Connected`);
  return server.listen({port: 5000});
})
.then( res => {
  console.log(`Server running at ${res.url}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
  process.exit(1);
});

const server = new ApolloServer({
  typeDefs,
  resolvers
});
