// import and from is ES6 syntax for importing modules
import express from 'express';

// mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
// it provides a schema-based solution to model our application data
import mongoose from 'mongoose';

import booksRoutes from './routes/booksRoutes.mjs';

import setupMiddleware from './middlewares/index.mjs';

const app = express();

// uri is the connection string for our MongoDB database that we are connecting to using the MongoClient class
// uri vs url - uri is a string that identifies a resource, url is a subset of uri that identifies a resource on the internet
const uri = "mongodb+srv://admin:EHxodiMJEmlrF3U6@cluster0.qhdcopl.mongodb.net/library?retryWrites=true&w=majority";

setupMiddleware(app)

const startServer = async (PORT = 3000) => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB')
    // Use the books routes for all requests to /api/v1/library/books
    app.use('/api/v1/library/books', booksRoutes);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(`Error connecting to MongoDB, ${error}`);
  }
}

setupMiddleware(app)
startServer()
