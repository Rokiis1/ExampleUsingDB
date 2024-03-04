import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';

import localStrategy from './strategies/localStrategy.mjs';
import jwtStrategy from './strategies/jwtStrategy.mjs';

import usersRouter from './routes/index.mjs';
import booksRouter from './routes/books.mjs';
import cookies from './middleware/cookies.mjs';

const app = express();

dotenv.config();

app.use(cookies);

app.use(express.json());

const PORT = 3000;

app.use(passport.initialize());

passport.use(localStrategy);
passport.use(jwtStrategy);

async function startServer() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('MongoDB connected...');

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