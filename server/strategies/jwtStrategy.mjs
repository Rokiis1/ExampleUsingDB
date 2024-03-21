// Import the JWT Strategy and ExtractJwt method from 'passport-jwt'.
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Import the dotenv module to load environment variables.
import dotenv from 'dotenv';

// Import the user model.
import userModel from '../models/userModel.mjs';

// Load environment variables from a .env file into process.env.
dotenv.config();

// Define the options for the JWT strategy.
const opts = {
	// Function that accepts a request as the only parameter and returns either the JWT as a string or null.
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	// Secret string which the JWT was signed with.
	secretOrKey: process.env.JWT_SECRET
};

// Define an asynchronous function to create the JWT strategy.
const createJwtStrategy = async () => {
	// Create a new JWT strategy.
	const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			// Try to find a user with the ID from the JWT payload.
			const user = await userModel.getUserById(jwt_payload.id); 
			if (user) {
				// If the user is found, call 'done' with the user object.
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