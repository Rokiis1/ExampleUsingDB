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
			const { username, password, email, registered_on, role = 'user' } = newUser;

			const result = await pool.query('INSERT INTO users (username, password, email, registered_on, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, password, email, registered_on, role]);
			return result.rows[0];
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	getUserByEmail: async ({email}) => {
		try {
			const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
			return result.rows[0];
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	login: async ({ username, email }) => {
		const userResult = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

		if (userResult.rows.length === 0) {
			throw new Error('User not found.');
		}

		const user = userResult.rows[0];

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

		return { user, book };
	},

	getUserById: async (id) => {
		const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
		return result.rows[0];
	},

	getUserReservations: async (userId) => {
		const result = await pool.query('SELECT books.* FROM users JOIN reservations ON users.id = reservations.user_id JOIN books ON reservations.book_id = books.id WHERE users.id = $1', [userId]);
		return result.rows;
	},

	updateUser: async (id, updatedUser) => {
		const { username, password, email } = updatedUser;
		const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
		const result = await pool.query('UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING *', [username, hashedPassword, email, id]);
		return result.rows[0];
	},

	updateUserFields: async (id, updatedFields) => {
		const setFields = Object.keys(updatedFields).map((key, i) => `${key} = $${i + 1}`).join(', ');
		const values = Object.values(updatedFields);
		values.push(id);
		const result = await pool.query(`UPDATE users SET ${setFields} WHERE id = $${values.length} RETURNING *`, values);
		return result.rows[0];
	},

	deleteUser: async (id) => {
		// Get all the reservations of the user
		const reservations = await pool.query('SELECT * FROM reservations WHERE user_id = $1', [id]);
		// Return all the books associated with the reservations
		for (let reservation of reservations.rows) {
			await pool.query('UPDATE books SET status = $1 WHERE id = $2', ['available', reservation.book_id]);
		}
		// Delete the reservations
		await pool.query('DELETE FROM reservations WHERE user_id = $1', [id]);

		// Delete the user
		const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
		return result.rows[0];
	}
	
};

export default userModel;