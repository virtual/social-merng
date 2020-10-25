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
  input LoginInput {
    username: String!
    password: String!
  }
  type Query {
    getPosts: [Post] #graphQl type post
    getPost(postId: ID!): Post
  }
  # Mutations make changes in db
  type Mutation { 
    register(registerInput: RegisterInput): User! # references Input, returns  User
    # login(loginInput: LoginInput): User
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(id: ID!): String!
  }
`; 
module.exports = typeDefs;