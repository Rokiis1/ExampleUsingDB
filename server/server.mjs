// import and from is ES6 syntax for importing modules
import express from 'express';
// cors is a module that allows us to make requests to our server from a different origin
import cors from 'cors';
// mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
// it provides a schema-based solution to model our application data
import mongoose from 'mongoose';

import booksController from './controllers/booksController.mjs';

const app = express();

// uri is the connection string for our MongoDB database that we are connecting to using the MongoClient class
// uri vs url - uri is a string that identifies a resource, url is a subset of uri that identifies a resource on the internet
const uri = "mongodb+srv://admin:EHxodiMJEmlrF3U6@cluster0.qhdcopl.mongodb.net/library?retryWrites=true&w=majority";

// express.json() is a built-in middleware function in Express
// .use is a method in Express that mounts the specified middleware function or functions at the specified path
// it parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json());

// cors() is a built-in middleware function in Express
// it allows us to make requests to our server from a different origin
app.use(cors());

// mongoose.connect is a method in Mongoose that connects to the MongoDB database
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB')

    app.get('/api/v1/library/books', booksController.getAllBooks);

    app.get('/api/v1/library/books/:id', booksController.getBookById);

    app.post('/api/v1/library/books/:id', booksController.createBook);

    app.put('/api/v1/library/books/:id', booksController.updateBook);

    app.delete('/api/v1/library/books/:id', booksController.deleteBook);

    app.patch('/api/v1/library/books/:id', booksController.updateBook);

});

const PORT = 3000;

// app.listen is a method in Express for starting the server
// what is listen doing? 
// listen is starting the server on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
