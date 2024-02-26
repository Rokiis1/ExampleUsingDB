import session from 'express-session';

export default session({
	secret: 'mySecret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
});