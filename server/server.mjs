// Importing express module
import express from 'express';

// Importing the router from the routes module
import usersRouter from './routes/index.mjs';

// Creating an express application
const app = express();

// express.json() is a built-in middleware function in Express
app.use(express.json());

// Use the router as middleware in your application
app.use('/api/v1/library', usersRouter);

// Have the app listen on a specific port
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running and listening on port ${port}`);
});