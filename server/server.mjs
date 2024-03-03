import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

import usersRouter from './routes/index.mjs';
import booksRouter from './routes/books.mjs';
import cookies from './middleware/cookies.mjs';

const app = express();

app.use(cookies);

app.use(express.json());

const PORT = 3000;

async function startServer() {
	try {
		await mongoose.connect('mongodb+srv://admin:DJxb2WCBuHtQ1sNU@cluster0.qhdcopl.mongodb.net/');
		console.log('MongoDB connected...');
		const client = mongoose.connection.getClient();

		app.use(session({
			secret: 'mySecret',
			resave: false,
			saveUninitialized: false,
			cookie: { secure: false, maxAge: 60 * 60 * 1000 },
			store: MongoStore.create({ clientPromise: Promise.resolve(client) })
		}));

		app.use('/api/v1/library', usersRouter);
		app.use('/api/v1/library', booksRouter);

		app.listen(PORT, () => {
			console.log(`Server is running and listening on port ${PORT}`);
		});
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
}

startServer();