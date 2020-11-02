const { AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      // put in try, if query fails
      try {
        const posts = await Post.find().sort({ createdAt: -1 }) // await because async
        return posts;
      }
      catch(err) {
        throw new Error(err)
      }
    },
    async getPost(_, {postId}) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found.")
        }
      } catch(err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      // Instead of passing the username
      // The JWT will authenticate the user
      // And pass the current user in the header
      const user = checkAuth(context);
      // console.log(user);
      // Since checkAuth either throws Errors or
      // continues normally, no if needed here
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      // User must also be author of post

      try {
        const post = await Post.findById(postId);
        // console.log(post)
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted succesfully";
        } else {
          throw new AuthenticationError("Action not allowed.")
        }
        // if post exists
        // await Post.deleteOne()
        
      } catch(err) {
        throw new Error(err);
      }
    }
  }
}