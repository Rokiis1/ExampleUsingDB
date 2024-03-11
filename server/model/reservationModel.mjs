import { pool } from '../db/postgresConnection.mjs';

const reservationModel = {
	getReservationByUserAndBook: async (userId, bookId) => {
		const result = await pool.query('SELECT * FROM reservations WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
		return result.rows[0];
	},

	deleteReservation: async (id) => {
		await pool.query('DELETE FROM reservations WHERE id = $1', [id]);
	},
};

export default reservationModel;