import bcrypt from 'bcrypt';

import { pool } from '../db/postgresConnection.mjs';

const userModel = {

	getUsers: async (paginate, page, limit) => {
		try {
			if (paginate === 'true') {
				const users = await pool.query('SELECT * FROM users OFFSET $1 LIMIT $2', [(page - 1) * limit, limit]);
				return users.rows;
			} else {
				const users = await pool.query('SELECT * FROM users ORDER BY id');
				return users.rows;
			}
		} catch (err) {
			console.error(err);
		}
	},

	createUser: async (newUser) => {
		try {
			const { username, password, email, registered_on } = newUser;

			const result = await pool.query('INSERT INTO users (username, password, email, registered_on) VALUES ($1, $2, $3, $4) RETURNING *', [username, password, email, registered_on]);
			return result.rows[0];
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	getUserByEmail: async (email) => {
		try {
			const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
			return result.rows[0];
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	login: async ({ username, email, password }) => {
		const userResult = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

		if (userResult.rows.length === 0) {
			throw new Error('User not found.');
		}

		const user = userResult.rows[0];

		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			throw new Error('Invalid credentials.');
		}

		// if (user.rows[0].password !== password) {
		// 	res.status(401).json({ message: 'Invalid credentials.' });
		// 	return;
		// }

		return user;
	},

	createReservation: async ({ userId, bookId }) => {
		const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
		const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);

		const user = userResult.rows[0];
		const book = bookResult.rows[0];

		if (!user || !book) {
			throw new Error('User or book not found.');
		}

		const reservationResult = await pool.query('SELECT * FROM reservations WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
		const reservation = reservationResult.rows[0];

		if (reservation) {
			throw new Error('Book is already reserved by the user.');
		}

		if (book.quantity === 0 || !book.available) {
			throw new Error('Book is not available.');
		}

		await pool.query('INSERT INTO reservations (user_id, book_id) VALUES ($1, $2)', [userId, bookId]);

		book.quantity--;

		if (book.quantity === 0) {
			book.available = false;
		}

		await pool.query('UPDATE books SET quantity = $1, available = $2 WHERE id = $3', [book.quantity, book.available, bookId]);

		return {user, book};
	}
};

export default userModel;