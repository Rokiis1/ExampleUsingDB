import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import userModel from '../models/userModel.mjs';

dotenv.config();

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
};

const createJwtStrategy = async () => {
	// jwt_payload is an object literal containing the decoded JWT payload.
	// decoded from the JWT is the _id of the user.
	const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await userModel.getUserById(jwt_payload.id); 
			if (user) {
				// The first argument is an error, and the second argument is the user.
				return done(null, user);
			}
			// The first argument is an error, and the second argument is false.
			return done(null, false);
		} catch (error) {
			return done(error, false);
		}
	});

	return jwtStrategy;
};

export default createJwtStrategy;