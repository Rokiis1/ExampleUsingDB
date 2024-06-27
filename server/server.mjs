// Importing necessary modules
// Express is a web application framework for Node.js, designed for building web applications and APIs.
import express from 'express';
// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
import dotenv from 'dotenv';
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
import cors from 'cors';

// Depending on the environment (production or development), different sets of environment variables will be loaded.
if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.dev' });
}

// Importing the function to connect to the database from the postgresConnection.mjs file.
import { connectDB } from './db/postgresConnection.mjs';

// Importing the passport object from the auth.mjs file. Passport is authentication middleware for Node.js.
import passport from './strategies/auth.mjs';

// Importing routers from the routes folder. These routers will be used to define the API routes.
import usersRouter from './routes/index.mjs';
import booksRouter from './routes/books.mjs';
import authorsRouter from './routes/authors.mjs';

// Importing the cookies middleware from the middleware folder. This middleware will be used to parse cookies from the request.
import cookies from './middleware/cookies.mjs';

// Importing the generalLimiter middleware from the middleware folder. This middleware will be used to rate limit requests to the API.
import { generalLimiter } from './middleware/rateLimit.mjs';

// Creating an instance of the express application.
const app = express();

// Setting up the cors options to allow requests from the client application.
const corsOptions = {
  origin: 'http://localhost:5173',
};

// Using the cors middleware with the corsOptions to allow requests from the client application.
app.use(cors(corsOptions));

// Setting up the static file serving middleware to serve the files in the public folder.
app.use(express.static('public'));

// Defining the startServer function to connect to the database and start the server.
const startServer = async () => {
  try {
    // Connecting to the database using the connectDB function and logging the message.
    const message = await connectDB();
    console.log(message);

    // Setting up the express application to use the cookies middleware and parse JSON requests.
    app.use(cookies);
    // Using express.json() middleware to parse incoming JSON requests and expose the resulting object on req.body.
    app.use(express.json());
    // Initializing passport for authentication.
    app.use(passport.initialize());

    // Defining the API routes using the routers from the routes folder.
    app.use(
      '/api/v1/library',
      generalLimiter,
      usersRouter,
      booksRouter,
      authorsRouter,
    );

    // Defining the port to listen on using the PORT environment variable.
    const port = process.env.PORT;

    // Starting the server and listening on the defined port.
    app.listen(port, () => {
      console.log(`Server is running and listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database', error);
    // Exiting the process with an error code if there is an error connecting to the database.
    process.exit(1);
  }
};

// Calling the startServer function to connect to the database and start the server.
startServer();
