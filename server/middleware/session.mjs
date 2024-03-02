import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from '../db/database.mjs';

// export default session({
// 	secret: 'mySecret',
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { secure: false },
// });

const setupSession = async () => {
	const client = await connectDB();
	return session({
		// Secret is a string that is used to sign the session ID cookie.
		secret: 'mySecret',
		resave: false,
		// SaveUninitialized is a boolean that specifies whether a new but unmodified session should be saved.
		saveUninitialized: false, // true
		cookie: { secure: false, maxAge: 60 * 60 * 1000 }, // 1 hour
		// Promises are used to resolve the client connection before creating the store instance with the client connection
		// This is because the client connection is a promise and the store instance requires a client connection
		// The client connection is resolved to a client instance before creating the store instance
		store: MongoStore.create({ clientPromise: Promise.resolve(client) })
	});
};

export default setupSession;