// Import the Book model
import Book from '../models/book.mjs';

// Define the controller object
const booksController = {};

// Get all books
booksController.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
};

// Get a book by id
booksController.getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        console.log(`Book with id ${id} fetched successfully`);
        res.send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching book');
    }
};

// Create a new book
booksController.createBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).send(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
};

// Update a book by id
booksController.updateBook = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await Book.updateOne({ _id: id }, updatedData);
        // modifiedCount is the number of documents that were modified
        if (result.modifiedCount > 0) {
            res.status(200).send('Book updated successfully');
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating book');
    }
};

// Delete a book by id
booksController.deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Book.deleteOne({ _id: id });

        if (result.deletedCount > 0) {
            res.status(200).send('Book deleted successfully');
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting book');
    }
};

// Update a book by id partially
booksController.patchBook = async (req, res) => {
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
};

// Export the controller
export default booksController;