import { pool } from '../db/postgresConnection.mjs';

import authorModel from './authorModel.mjs';

const bookModel = {
  // getBooks: This asynchronous function fetches all books from the database, along with the name of their author. It uses the pool.query method from the pg library to execute a SQL query that selects all columns from the books table and the name column from the authors table, joining on the author_id column. If an error occurs, it logs the error and throws it.
  getBooks: async () => {
    try {
      const result = await pool.query(`
            SELECT books.*, authors.name AS author_name
            FROM books
            INNER JOIN authors ON books.author_id = authors.id
        `);
      return result.rows;
    } catch (error) {
      console.error('An error occurred while fetching books.', error);
      throw error;
    }
  },

  // getBookById: This asynchronous function fetches a book by its ID from the database, along with the name of its author. It uses the pool.query method to execute a SQL query that selects all columns from the books table and the name column from the authors table, joining on the author_id column, and filtering by the book's ID. If an error occurs, it logs the error and throws it.
  getBookById: async (id) => {
    try {
      const result = await pool.query(
        `
			SELECT books.*, authors.name AS author_name
			FROM books
			INNER JOIN authors ON books.author_id = authors.id
			WHERE books.id = $1
		`,
        [id],
      );
      return result.rows[0];
    } catch (error) {
      console.error('An error occurred while fetching the book.', error);
      throw error;
    }
  },

  // searchBooksByTitle: This asynchronous function searches for books by their title, returning all matching books along with the name of their author. It uses the pool.query method to execute a SQL query that selects all columns from the books table and the name column from the authors table, joining on the author_id column, and filtering by the book's title using a LIKE clause. If an error occurs, it logs the error and throws it.
  searchBooksByTitle: async (title) => {
    try {
      const result = await pool.query(
        `
				SELECT books.*, authors.name AS author_name
				FROM books
				INNER JOIN authors ON books.author_id = authors.id
				WHERE books.title LIKE $1
			`,
        [`%${title}%`],
      );
      return result.rows;
    } catch (error) {
      console.error('An error occurred while searching for books.', error);
      throw error;
    }
  },

  // createBook: This asynchronous function creates a new book in the database. It first checks if the author exists by calling the getAuthorById method from the authorModel. It then inserts the new book into the books table using the pool.query method. If an error occurs, it logs the error and throws it. It also ensures that the database connection is released back to the pool, regardless of whether an error occurred.
  createBook: async (bookData) => {
    const client = await pool.connect();
    try {
      const { title, author_id, published_on, quantity } = bookData;

      // Check if author exists
      await authorModel.getAuthorById(author_id);

      const available = quantity > 0;

      const result = await client.query(
        'INSERT INTO books (title, author_id, published_on, quantity, available) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, author_id, published_on, quantity, available],
      );

      const book = result.rows[0];

      return book;
    } catch (error) {
      console.error('An error occurred while creating the book.', error);
      throw error;
    } finally {
      client.release();
    }
  },

  // incrementBookQuantity: This asynchronous function increments the quantity of a book by its ID. It uses the pool.query method to execute a SQL query that increments the quantity column of the books table for the given book ID.
  incrementBookQuantity: async (id) => {
    await pool.query('UPDATE books SET quantity = quantity + 1 WHERE id = $1', [
      id,
    ]);
  },

  // decrementBookQuantity: This asynchronous function decrements the quantity of a book by its ID. It uses the pool.query method to execute a SQL query that decrements the quantity column of the books table for the given book ID.
  decrementBookQuantity: async (id) => {
    await pool.query('UPDATE books SET quantity = quantity - 1 WHERE id = $1', [
      id,
    ]);
  },

  // updateBookAvailability: This asynchronous function updates the availability of a book by its ID. It uses the pool.query method to execute a SQL query that updates the available column of the books table for the given book ID.
  updateBookAvailability: async (id, available) => {
    await pool.query('UPDATE books SET available = $1 WHERE id = $2', [
      available,
      id,
    ]);
  },

  // returnUserBooks: This asynchronous function updates the availability of multiple books based on an array of reservations. It iterates over the reservations and for each one, it uses the pool.query method to execute a SQL query that updates the available column of the books table for the given book ID.
  returnUserBooks: async (reservations) => {
    for (let reservation of reservations) {
      await pool.query('UPDATE books SET available = $1 WHERE id = $2', [
        true,
        reservation.book_id,
      ]);
    }
  },
};

export default bookModel;
