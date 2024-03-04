import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/userSchema.mjs';

dotenv.config();

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
};

// jwt_payload is an object literal containing the decoded JWT payload.
// decoded from the JWT is the _id of the user.
const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
	try {
		const user = await User.findById(jwt_payload._id);
		if (user) {
			// The first argument is an error, and the second argument is the user.
			return done(null, user);
		}
		// The first argument is an error, and the second argument is false.
		return done(null, false);
		
	} catch (err) {
		return done(err, false);
	}
});

export default jwtStrategy;