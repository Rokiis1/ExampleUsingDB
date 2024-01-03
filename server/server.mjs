// import and from is ES6 syntax for importing modules
import express from 'express';
// cors is a module that allows us to make requests to our server from a different origin
import cors from 'cors';
// mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
// it provides a schema-based solution to model our application data
import mongoose from 'mongoose';

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

    app.get('/api/v1/library/books', async (req, res) => {
        try {
            // Book is the model we created with mongoose.model 
            // Use the find method without any arguments to get all books
            const books = await Book.find();
    
            res.send(books);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    });

    app.get('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            // Use the findById method to find a book by its _id
            const book = await Book.findById(id);
    
            if (!book) {
                return res.status(404).send('Book not found');
            }
    
            res.send(book);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching book');
        }
    });

    app.post('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const newBookData = req.body;
            // Use the updateOne method to update a book by its _id
            // newBookData is an object with the data that we want to update
            // sytax updateOne(id, data) 
            const result = await Book.updateOne({ _id: id }, newBookData);
            if (result.nModified > 0) {
                console.log(`Successfully updated book with _id: ${id}`);
                res.status(200).send('Book updated successfully');
            } else {
                console.error('Error updating book in database');
                res.status(500).send('Error updating book in database');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error saving data');
        }
    });

    app.put('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const updatedData = req.body;
    
            // Use the findByIdAndUpdate method to update a book by its _id
            // The { new: true } option tells mongoose to return the updated book
            const book = await Book.findByIdAndUpdate(id, updatedData, { new: true });
    
            if (!book) {
                return res.status(404).send('Book not found');
            }
            res.send(book);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating book');
        }
    });

    app.delete('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
    
            // Use the findByIdAndDelete method to delete a book by its _id
            // The method returns the deleted book document 
            const book = await Book.findByIdAndDelete(id);
    
            if (!book) {
                return res.status(404).send('Book not found');
            }
    
            res.status(200).send('Book deleted successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting book');
        }
    });

    app.patch('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const update = req.body;
    
            // Use the findByIdAndUpdate method to update a book by its _id
            // The $set operator replaces the value of a field with the specified value
            const book = await Book.findByIdAndUpdate(id, { $set: update }, { new: true });
    
            if (!book) {
                return res.status(404).send('Book not found');
            }
    
            res.send('Book updated successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating book');
        }
    });

})
  .catch(err => console.error('Error connecting to MongoDB:', err));

const PORT = 3000;

// app.listen is a method in Express for starting the server
// what is listen doing? 
// listen is starting the server on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
