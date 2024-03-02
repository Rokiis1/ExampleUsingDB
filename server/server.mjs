import express from 'express';

import usersRouter from './routes/index.mjs';
import booksRouter from './routes/books.mjs';
import setupSession from './middleware/session.mjs';
import cookies from './middleware/cookies.mjs';
import connectDB from './db/database.mjs'; // Import connectDB

const app = express();

const session = await setupSession();

// Connect to database
connectDB();

app.use(cookies);
app.use(session);

app.use(express.json());

app.use('/api/v1/library', usersRouter);
app.use('/api/v1/library', booksRouter);

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running and listening on port ${port}`);
});