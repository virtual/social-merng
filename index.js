// Dependency imports
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
require('dotenv').config();

// Relative imports
const Post = require('./models/Post');

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

const typeDefs = gql`
  type Post {
    id: ID!,
    body: String!,
    username: String!,
    createdAt: String!
  }
  type Query {
    getPosts: [Post] #graphQl type post
  }
`; 
// For each query, mutation or subscription has a 
// corresponding resolver
const resolvers = {
  Query: {
    async getPosts() {
      // put in try, if query fails
      try {
        const posts = await Post.find() // await because async
        return posts;
      }
      catch(err) {
        throw new Error(err)
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});
