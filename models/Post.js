const { model, Schema } = require('mongoose');
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String, // graphql side for default date
  comments: [{
    body: String,
    username: String,
    createdAt: String
  }],
  likes: [{
    username: String,
    createdAt: String
  }],
  user: { // Link datamodels
    type: Schema.Types.ObjectId,  // allows us to use 
                                  // Mongoose to later populate user field
    ref: 'Users' // pass collection Users
  }
});
module.exports = model('Post', postSchema);