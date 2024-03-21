import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

import userModel from '../models/userModel.mjs';

const localStrategy = new LocalStrategy({
	usernameField: 'login',
	passwordField: 'password',
	// passReqToCallback what is this? 
	// This option allows us to pass the request object to the callback function.
	// This is useful when we need to access the request object in the callback function.
	// In this case, we need to access the request object to get the user's login information.
	passReqToCallback: true
}, async (req, login, password, done) => {
	try {
		const user = await userModel.login({ username: login, email: login });
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return done(null, false, { message: 'Invalid credentials.' });
		}
		//  what is null? 
		// The first argument of the done function is an error object.
		// If an error occurs, we pass the error object to the done function.
		// In this case, there is no error, so we pass null as the first argument.
		// but why we not write error tehn?
		// so why I just i nstead using error?
		//  why we not use error insewtad we use a null?

		return done(null, user);

	} catch (error) {
		{
			if (error.message === 'User not found.') {
				return done(null, false, { message: error.message });
			}
			return done(error);
		}
	}
});

export default localStrategy;