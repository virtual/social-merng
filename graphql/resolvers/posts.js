const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
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
    }
  }
}