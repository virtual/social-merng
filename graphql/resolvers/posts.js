const Post = require('../../models/Post');

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
    }
  }
}