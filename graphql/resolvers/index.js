const postResolvers = require('./posts');
const userResolvers = require('./users');

// Keep this updated with new sections
module.exports = {
  Query: { 
    ...postResolvers.Query
    // ...userResolvers
  },
  Mutation: {
    ...postResolvers.Mutation,
    ...userResolvers.Mutation
  }
}