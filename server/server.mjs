import express from 'express';

import usersRouter from './routes/index.mjs';
import booksRouter from './routes/books.mjs';
import authorsRouter from './routes/authors.mjs';
import cookies from './middleware/cookies.mjs';
import { connectDB } from './db/postgresConnection.mjs'; // Import connectDB

const app = express();

const startServer = async () => {
	try {
		const message = await connectDB();
		console.log(message);

		app.use(cookies);
		app.use(express.json());

		app.use('/api/v1/library', usersRouter, booksRouter, authorsRouter);

		const port = 3000;

		app.listen(port, () => {
			console.log(`Server is running and listening on port ${port}`);
		});

	} catch (error) {
		console.error('Failed to connect to database', error);
	}
};

startServer();