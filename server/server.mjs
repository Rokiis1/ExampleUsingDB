import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // import cors

if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: '.env.production' });
} else {
	dotenv.config({ path: '.env.local' });
}

import { connectDB } from './db/postgresConnection.mjs'; // Import connectDB

import passport from './strategies/auth.mjs';

import usersRouter from './routes/index.mjs';
import booksRouter from './routes/books.mjs';
import authorsRouter from './routes/authors.mjs';

import cookies from './middleware/cookies.mjs';
import { generalLimiter } from './middleware/rateLimit.mjs';

const app = express();

// Set up CORS options
const corsOptions = {
	origin: 'http://localhost:5173', // Allow the React app to connect to the server
};
  
app.use(cors(corsOptions)); // use cors as a middleware with options

const startServer = async () => {
	try {
		const message = await connectDB();
		console.log(message);

		app.use(cookies);
		app.use(express.json());

		app.use(passport.initialize());

		app.use('/api/v1/library', generalLimiter, usersRouter, booksRouter, authorsRouter);

		const port = process.env.PORT;

		app.listen(port, () => {
			console.log(`Server is running and listening on port ${port}`);
		});

	} catch (error) {
		console.error('Failed to connect to database', error);

		process.exit(1);
	}
};

startServer();