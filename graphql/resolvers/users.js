const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput } = require('../../util/validator');

require('dotenv').config();

module.exports = {
  Mutation: {
    // register(parent, args, context, info), parent doesn't exist
    // register(_, args, context, info){ // Need to further destructure args
    async register(_, { 
      registerInput: 
      { username, email, password, confirmPassword } 
    }, 
      // context, // Not used
      // info
      ) {
      // TODO: validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // TODO: Check user doesn't exist
      const user = await User.findOne({
        username: username
      })
      if (user) {
        throw new UserInputError("Username is not available.", 
        {
          // payload
          errors: {
            username: "taken"
          }
        })
      }
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