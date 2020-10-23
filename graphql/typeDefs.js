const gql = require('graphql-tag');
const typeDefs = gql`
  type Post {
    id: ID! # ! User can opt out, but we have to return it
    body: String!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post] #graphQl type post
  }
  # Mutations make changes in db
  type Mutation { 
    register(registerInput: RegisterInput): User # references Input
  }
`; 
module.exports = typeDefs;