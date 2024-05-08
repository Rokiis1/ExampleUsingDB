import bookModel from '../models/bookModel.mjs';
import authorModel from '../models/authorModel.mjs';

const booksController = {
  // getBooks: This asynchronous function handles GET requests to fetch all books. It uses the getBooks method from the bookModel to fetch the books from the database. If successful, it sends a response with HTTP status 200 and the list of books. If an error occurs, it sends a response with HTTP status 500 and an error message.
  getBooks: async (req, res) => {
    try {
      const books = await bookModel.getBooks();
      res.status(200).json(books);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'An error occurred while fetching books.' });
    }
  },

  // searchBooksByTitle: This asynchronous function handles GET requests to search for books by title. It first checks if the title query parameter is provided in the request. If not, it sends a response with HTTP status 400 and an error message. If the title is provided, it uses the searchBooksByTitle method from the bookModel to search for books with the given title. If no books are found, it sends a response with HTTP status 404 and an error message. If books are found, it sends a response with HTTP status 200 and the list of books. If an error occurs, it sends a response with HTTP status 500 and an error message.
  searchBooksByTitle: async (req, res) => {
    try {
      const title = req.query.title;
      console.log(title);
      if (!title) {
        res.status(400).json({ message: 'Title is required.' });
        return;
      }
      const books = await bookModel.searchBooksByTitle(title);
      if (books.length === 0) {
        res.status(404).json({ message: 'No books found.' });
        return;
      }

      res.status(200).json(books);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'An error occurred while fetching books.' });
    }
  },

  // createBook: This asynchronous function handles POST requests to create a new book. It first checks if the author of the book exists in the database using the getAuthorById method from the authorModel. If the author does not exist, it sends a response with HTTP status 404 and an error message. If the author exists, it uses the createBook method from the bookModel to create a new book in the database with the data provided in the request body. If successful, it sends a response with HTTP status 201 and the created book. If an error occurs, it sends a response with HTTP status 500 and an error message.

  createBook: async (req, res) => {
    try {
      const { author_id } = req.body;

      // Check if author exists
      await authorModel.getAuthorById(author_id);

      const book = await bookModel.createBook(req.body);

      res.status(201).json(book);
    } catch (err) {
      if (err.message === 'Author not found.') {
        res.status(404).json({ message: 'Author not found.' });
        return;
      } else {
        res
          .status(500)
          .json({ message: 'An error occurred while creating the book.' });
      }
    }
  },
};

export default booksController;
