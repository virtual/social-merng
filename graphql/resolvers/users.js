const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  Mutation: {
    // register(parent, args, context, info), parent doesn't exist
    // register(_, args, context, info){ // Need to further destructure args
    async register(_, { registerInput: { username, password, confirmPassword, email } }, 
      context, info) {
      // TODO: validate user data
      // TODO: Check user doesn't exist
      // TODO: Hash password
      // TODO: Create auth token
      password = await bcrypt.hash(password, 12); // bcrypt is async

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      }, process.env.SALT, { expiresIn: '1h' });
      
      return { 
        ...res._doc,
        id: res._id, // Id is not in the default doc
        token
      }
    }
  }
};