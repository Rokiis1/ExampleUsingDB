// import and from is ES6 syntax for importing modules
import express from 'express';
// cors is a module that allows us to make requests to our server from a different origin
import cors from 'cors';
// MongoClient is a class that allows us to connect to our MongoDB database
// import { MongoClient } from 'mongodb';
// mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
// it provides a schema-based solution to model our application data
import mongoose from 'mongoose';

const app = express();

// uri is the connection string for our MongoDB database that we are connecting to using the MongoClient class
// uri vs url - uri is a string that identifies a resource, url is a subset of uri that identifies a resource on the internet
const uri = "mongodb+srv://admin:EHxodiMJEmlrF3U6@cluster0.qhdcopl.mongodb.net/library?retryWrites=true&w=majority";
// new MongoClient(uri) is creating a new instance of the MongoClient class and passing in the uri as an argument
// const client = new MongoClient(uri);

// express.json() is a built-in middleware function in Express
// .use is a method in Express that mounts the specified middleware function or functions at the specified path
// it parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json());

// cors() is a built-in middleware function in Express
// it allows us to make requests to our server from a different origin
app.use(cors());

// Define your Mongoose schema
//  mongoose.Schema is a class that allows us to create a schema for our data
//  a schema is a blueprint for our data that we will be storing in our database
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
});

// Create your Mongoose model
// mongoose.model is a method that allows us to create a model for our data
// a model is a class that is built from a schema and allows us to create documents
// arguments for mongoose.model are (modelName, schema)
const Book = mongoose.model('Book', bookSchema);

// mongoose.connect is a method in Mongoose that connects to the MongoDB database
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB')
    app.post('/api/v1/books', async (req, res) => {
        try {
            // new Book(req.body) is creating a new instance of the Book class and passing in the request body as an argument
            const newBook = new Book(req.body);
            // newBook.save() is saving the newBook instance to the database
            const result = await newBook.save();
            if (result._id) {
                console.log(`Successfully inserted book with _id: ${result._id}`);
                res.status(201).send(newBook);
            } else {
                console.error('Error inserting book into database');
                res.status(500).send('Error inserting book into database');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving data');
        }
    });

})
  .catch(err => console.error('Error connecting to MongoDB:', err));

// client.connect is a method in the MongoClient class that connects to the MongoDB database
// client.connect().then(() => {
//     console.log('Connected to MongoDB');

//     app.post('/api/v1/books', async (req, res) => {
//         try {
//             const newBook = req.body;
//             // client.db('library') is selecting the library database
//             // client.db('library').collection('books') is selecting the books collection in the library database
//             const collection = client.db('library').collection('books');
//             // collection.insertOne is inserting a new document into the books collection
//             // newBook is the document being inserted
//             const result = await collection.insertOne(newBook);
//             if (result.insertedId) {
//                 console.log(`Successfully inserted book with _id: ${result.insertedId}`);
//                 res.status(201).send(newBook);
//             } else {
//                 console.error('Error inserting book into database');
//                 res.status(500).send('Error inserting book into database');
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Error saving data');
//         }
//     });


//     const PORT = 3000;

//     // app.listen is a method in Express for starting the server
//     // what is listen doing? 
//     // listen is starting the server on the specified port
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch(err => {
//     console.log(err);
// });

const PORT = 3000;

// app.listen is a method in Express for starting the server
// what is listen doing? 
// listen is starting the server on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
