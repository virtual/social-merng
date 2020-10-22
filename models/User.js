// Holds info about the schema
const { model, Schema } = require('mongoose');
const userSchema = new Schema({
  username: String, // Can use graphql to require instead of here
  password: String,
  email: String,
  createdAt: String
});
module.exports = model('User', userSchema);