const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../util/validator');

require('dotenv').config();

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, process.env.SALT, { expiresIn: '1h' });
}

module.exports = {
  // Each mutation needs to be added to typeDefs
  Mutation: {
    async login(_, {
      username,
      password
    }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username});

      // don't continue if input is invalid
      if (!valid) {
        throw new UserInputError("Invalid input", { errors })
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors })
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "Wrong credentials";
          throw new UserInputError("Wrong credentials", { errors })
        }
      }

      // User & Pw ok
      // Return token
      const token =  generateToken(user);
      
      return { 
        ...user._doc,
        id: user._id, // Id is not in the default doc
        token
      }
    },
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
        throw new UserInputError("Username is not available", 
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

      const token =  generateToken(res);
      
      return { 
        ...res._doc,
        id: res._id, // Id is not in the default doc
        token
      }
    }
  }
};