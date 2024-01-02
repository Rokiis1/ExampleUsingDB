// import and from is ES6 syntax for importing modules
import express from 'express';
// cors is a module that allows us to make requests to our server from a different origin
import cors from 'cors';
// MongoClient is a class that allows us to connect to our MongoDB database
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

// uri is the connection string for our MongoDB database that we are connecting to using the MongoClient class
// uri vs url - uri is a string that identifies a resource, url is a subset of uri that identifies a resource on the internet
const uri = "mongodb+srv://admin:EHxodiMJEmlrF3U6@cluster0.qhdcopl.mongodb.net/library?retryWrites=true&w=majority";
// new MongoClient(uri) is creating a new instance of the MongoClient class and passing in the uri as an argument
const client = new MongoClient(uri);

// express.json() is a built-in middleware function in Express
// .use is a method in Express that mounts the specified middleware function or functions at the specified path
// it parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json());

// cors() is a built-in middleware function in Express
// it allows us to make requests to our server from a different origin
app.use(cors());

// client.connect is a method in the MongoClient class that connects to the MongoDB database
client.connect().then(() => {
    console.log('Connected to MongoDB');

    app.get('/api/v1/library/books', async (req, res) => {
        try {
            await client.connect();
            const collection = client.db("library").collection("books"); 
            // find() is a method in the Collection class that returns a cursor to the documents in the collection
            // toArray() is a method in the Cursor class that returns an array that contains all documents from the cursor
            const data = await collection.find().toArray();
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        } finally {
            await client.close();
        }
    });

    app.get('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const collection = client.db('library').collection('books');
            // findOne is a method in the Collection class that returns one document that matches the query criteria
            // _id is the field in the document that we are querying
            // new ObjectId(id) is converting the id string into an ObjectId
            // ObjectId is a class that represents a BSON ObjectId
            // BSON is a binary representation of JSON documents
            // BSON is designed to be lightweight, traversable, and efficient
            // BSON is used in MongoDB for storage and network transfer of documents
            // BSON is designed to be fast to encode and decode in different languages
            // BSON is a binary format in which zero or more key/value pairs are stored as a single entity
            // BSON is a superset of JSON
            // BSON is designed to be efficient in space, but in some cases is not much more efficient than JSON
            const book = await collection.findOne({ _id: new ObjectId(id) });
    
            if (!book) {
                return res.status(404).send('Book not found');
            }
    
            res.send(book);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching book');
        }
    });

    app.post('/api/v1/library/books', async (req, res) => {
        try {
            const newBook = req.body;
            // client.db('library') is selecting the library database
            // client.db('library').collection('books') is selecting the books collection in the library database
            const collection = client.db('library').collection('books');
            // collection.insertOne is inserting a new document into the books collection
            // newBook is the document being inserted
            const result = await collection.insertOne(newBook);
            if (result.insertedId) {
                console.log(`Successfully inserted book with _id: ${result.insertedId}`);
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

    app.put('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const updatedData = req.body;
            const collection = client.db('library').collection('books');
    
            // updateOne is a method in the Collection class that updates a single document that matches the query criteria
            // _id is the field in the document that we are querying
            // new ObjectId(id) is converting the id string into an ObjectId
            // ObjectId is a class that represents a BSON ObjectId
            // $set is an update operator that sets the value of a field in a document
            // $set is a field name that contains update operators
            // $set is a field value that contains the update operator expression
            // $set is a field value that is an array of documents that contain fields to update and their values
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            // matchedCount is the number of documents that matched the filter criteria in the updateOne method call
            if (result.matchedCount === 0) {
                return res.status(404).send('Book not found');
            }
    
            res.send(updatedData);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating book');
        }
    });

    app.delete('/api/v1/library/books/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const collection = client.db('library').collection('books');
    
            // deleteOne is a method in the Collection class that deletes a single document that matches the query criteria
            // _id is the field in the document that we are querying
            // new ObjectId(id) is converting the id string into an ObjectId
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
            if (result.deletedCount === 0) {
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
            const collection = client.db('library').collection('books');
    
            // updateOne is a method in the Collection class that updates a single document that matches the query criteria
            // _id is the field in the document that we are querying
            // new ObjectId(id) is converting the id string into an ObjectId
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: update }
            );
    
            if (result.matchedCount === 0) {
                return res.status(404).send('Book not found');
            }
    
            res.send('Book updated successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating book');
        }
    });

    const PORT = 3000;

    // app.listen is a method in Express for starting the server
    // what is listen doing? 
    // listen is starting the server on the specified port
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

