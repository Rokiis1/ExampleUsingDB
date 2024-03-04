import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';

import User from '../models/userSchema.mjs';

const localStrategy = new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, async (username, password, done) => {
	try {
		const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
		if (!user) {
			return done(null, false, { message: 'User not found.' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		// console.log(user, isMatch);
		if (!isMatch) {
			return done(null, false, { message: 'Invalid credentials.' });
		}

		return done(null, user);
	} catch (err) {
		return done(err);
	}
});

export default localStrategy;

