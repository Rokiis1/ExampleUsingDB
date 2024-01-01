// import and from is ES6 syntax for importing modules
import express from 'express';
// assert is a built-in module in Node.js for testing assumptions 
// about the state of the program
import data from './data.json' assert { type: "json" };
// fs is a built-in module in Node.js for interacting with the file system
import fs from 'fs';
// cors is a module that allows us to make requests to our server from a different origin
import cors from 'cors';
// path is a built-in module in Node.js for working with file paths
// { dirname } is a named export from the path module
import path, { dirname } from 'path';
// fileURLToPath is a built-in module in Node.js for converting a file URL to a file path
import { fileURLToPath } from 'url';

// __dirname is a variable that contains the absolute path to the directory
// where the current file is located
// __ why is this necessary?
// __dirname is not available in ES6 modules because ES6 modules are loaded asynchronously
// and __dirname is only available synchronously
// __dirname is available in CommonJS modules
// CommonJS modules are loaded synchronously
const __dirname = dirname(fileURLToPath(import.meta.url));


// create an instance of the express application
const app = express();
// express.json() is a built-in middleware function in Express
app.use(express.json());

// cors() is a built-in middleware function in Express
app.use(cors());

// app.get is a method in Express for handling GET requests
// app.get takes two arguments: a path and a callback function
// the callback function takes two arguments: req and res
// req is an object that represents the HTTP request
// res is an object that represents the HTTP response
app.get('/data', async (req, res) => {
    try {
        // res.send sends a response of the specified type to the client
        // res.send takes one argument: the data to send
        res.send(data);
    } catch (error) {
        console.error(error);
        // res.status sets the HTTP status code of the response
        // res.status takes one argument: the HTTP status code to set on the response
        res.status(500).send('Error fetching data');
    }
});

// get a single book by id 
app.get('/data/:id', (req, res) => {
    // req.params is an object that contains the parameters of the request
    // req.params is an object where the keys are the parameter names
    // and the values are the parameter values
    //  Number is a built-in function in JavaScript that converts a value to a number
    const id = Number(req.params.id);

    // find is a built-in method on arrays in JavaScript that returns the first element
    // in the array that satisfies the condition in the callback function
    // if no element satisfies the condition, find returns undefined
    const book = data.books.find(book => book.id === id);

    // if no book is found, send a 404 response
    if (!book) {
        return res.status(404).send('Book not found');
    }

    // if a book is found, send the book
    res.send(book);
});

app.post('/data', async (req, res) => {
    try {
        // req.body is an object that contains the data from the request body
        // req.body is only available if the express.json() middleware is used
        // req.body is only available for POST, PUT, and PATCH requests
        const newBook = req.body;

        // maxId is the largest id in the books array
        // if the books array is empty, maxId is 0
        // if the books array is not empty, maxId is the largest id in the books array
        const maxId = data.books.length ? Math.max(...data.books.map(book => book.id)) : 0;
        // add 1 to maxId to get the id for the new book
        newBook.id = maxId + 1;

        // add the new book to the books array
        data.books.push(newBook);

        // write the updated data to the data.json file
        // JSON.stringify converts a JavaScript object to a JSON string
        // JSON.stringify takes three arguments:
        // 1. the JavaScript object to convert to a JSON string
        // 2. a replacer function or array of strings that specifies how to convert values to strings
        // null specifies that no replacer function or array of strings is used
        // 3. the number of spaces to use for indentation when formatting the JSON string
        await fs.promises.writeFile(path.resolve(__dirname, './data.json'), JSON.stringify(data, null, 2));

        // send the new book to the client
        res.status(201).send(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data')
    }
});

// update a book by id
app.put('/data/:id', async (req, res) => {
    try {
        // req.params is an object that contains the parameters of the request
        // id is the id of the book to update
        const id = Number(req.params.id);
        // req.body is an object that contains the data from the request body
        // updateData is the data to use to update the book
        const updatedData = req.body;

        // findIndex is a built-in method on arrays in JavaScript that returns the index
        // of the first element in the array that satisfies the condition in the callback function
        // if no element satisfies the condition, findIndex returns -1
        const bookIndex = data.books.findIndex(book => book.id === id);

        // if bookIndex is -1, the book was not found
        if (bookIndex === -1) {
            res.status(404).send('Book not found');
            return;
        }

        // update the book in the books array with the updatedData object from the request body        
        data.books[bookIndex] = updatedData;
        await fs.promises.writeFile(path.resolve(__dirname, './data.json'), JSON.stringify(data, null, 2));
        res.send(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating data');
    }
});

app.delete('/data/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        // findIndex is a built-in method on arrays in JavaScript that returns the index
        // but why using findIndex instead of find? 
        // findIndex is used instead of find because findIndex returns the index of the element
        // and find returns the element itself
        const index = data.books.findIndex(book => book.id === id);

        // if index is -1, the book was not found
        if (index === -1) {
            return res.status(404).send('Book not found');
        } else {
            data.books.splice(index, 1);
            await fs.promises.writeFile(path.resolve(__dirname, './data.json'), JSON.stringify(data, null, 2));
            res.status(200).send('Book deleted successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting book');
    }
});

const PORT = 3000;

// app.listen is a method in Express for starting the server
// what is listen doing? 
// listen is starting the server on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

