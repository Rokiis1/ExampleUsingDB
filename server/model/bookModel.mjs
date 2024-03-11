import { pool } from '../db/postgresConnection.mjs';

const bookModel = {

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

	getBookById: async (id) => {
		try {
			const result = await pool.query(`
			SELECT books.*, authors.name AS author_name
			FROM books
			INNER JOIN authors ON books.author_id = authors.id
			WHERE books.id = $1
		`, [id]);
			return result.rows[0];
		} catch (error) {
			console.error('An error occurred while fetching the book.', error);
			throw error;
		}
	},

	createBook: async (bookData) => {
		const client = await pool.connect();
		try {
			const { title, author_id, published_on, quantity } = bookData;

			const authorResult = await client.query('SELECT id FROM authors WHERE id = $1', [author_id]);

			if (authorResult.rows.length === 0) {
				throw new Error('Author not found.');
			}

			const available = quantity > 0;

			const result = await client.query('INSERT INTO books (title, author_id, published_on, quantity, available) VALUES ($1, $2, $3, $4, $5) RETURNING *', [title, author_id, published_on, quantity, available]);

			const book = result.rows[0];
            
			return book;
		} catch (error) {
			console.error('An error occurred while creating the book.', error);
			throw error;
		} finally {
			client.release();
		}
	},

	incrementBookQuantity: async (id) => {
		await pool.query('UPDATE books SET quantity = quantity + 1 WHERE id = $1', [id]);
	},

	updateBookAvailability: async (id, available) => {
		await pool.query('UPDATE books SET available = $1 WHERE id = $2', [available, id]);
	}
};

export default bookModel;