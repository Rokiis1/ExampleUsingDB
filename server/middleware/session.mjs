import session from 'express-session';

export default session({
	// what is secret?
	// Secret is a string that is used to sign the session ID cookie.
	secret: 'mySecret',
	// what is resave?
	// Resave is a boolean that specifies whether the session should be saved if it hasn't been modified.
	resave: false,
	// what is saveUninitialized?
	// SaveUninitialized is a boolean that specifies whether a new but unmodified session should be saved.
	saveUninitialized: false, 
	// what is cookie?
	// Cookie is an object that specifies the session cookie.
	cookie: { secure: false, maxAge: 60 * 60 * 1000 } // 1 hour
});