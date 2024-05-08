// Import the JWT strategy from the passport-jwt module.
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import userModel from '../models/userModel.mjs';

// Load the environment variables based on the NODE_ENV value (prod or dev).
if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.dev' });
}

// Define the options for the JWT strategy.
const opts = {
  //  // Extract the JWT token from the Authorization header.
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Define the secret key for the JWT token.
  secretOrKey: process.env.JWT_SECRET,
};

//  createJwtStrategy function to create a new JWT strategy. We will use this function to create a new JWT strategy for passport authentication.
const createJwtStrategy = async () => {
  //  Create a new JWT strategy with the options defined above.
  const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Try to find a user with the ID from the JWT payload.
      const user = await userModel.getUserById(jwt_payload.id);
      if (user) {
        // If the user is found, call 'done' with the user object.
        // null is the error object, user is the user object, and null is the info object.
        return done(null, user);
      }
      // If the user is not found, call 'done' with false.
      return done(null, false);
    } catch (error) {
      // If there's an error, call 'done' with the error and false.
      return done(error, false);
    }
  });

  // Return the JWT strategy.
  return jwtStrategy;
};

// Export the function to create the JWT strategy.
export default createJwtStrategy;
