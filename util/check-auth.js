const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Convention for auth tokens: "Bearer ..."
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      // Ensure we issued this token & it's not expired
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch(err) {
        throw new AuthenticationError("Invalid/expired token");
      }
    } 
  } else {
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error("Authorization header must be provided");
};