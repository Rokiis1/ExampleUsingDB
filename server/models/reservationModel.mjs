import { pool } from '../db/postgresConnection.mjs';

const reservationModel = {
  // getReservationByUserAndBook: This asynchronous function fetches a reservation by a user ID and a book ID from the database. It uses the pool.query method from the pg library to execute a SQL query that selects all columns from the reservations table where the user_id and book_id match the provided IDs.
  getReservationByUserAndBook: async (userId, bookId) => {
    const result = await pool.query(
      'SELECT * FROM reservations WHERE user_id = $1 AND book_id = $2',
      [userId, bookId],
    );
    return result.rows[0];
  },

  // createReservation: This asynchronous function creates a new reservation in the database. It uses the pool.query method to execute a SQL query that inserts a new row into the reservations table with the provided user_id and book_id, and returns the newly created reservation.
  createReservation: async (userId, bookId) => {
    const result = await pool.query(
      'INSERT INTO reservations (user_id, book_id) VALUES ($1, $2) RETURNING *',
      [userId, bookId],
    );
    return result.rows[0];
  },

  // deleteReservation: This asynchronous function deletes a reservation by its ID from the database. It uses the pool.query method to execute a SQL query that deletes the row from the reservations table where the id matches the provided ID.
  deleteReservation: async (id) => {
    await pool.query('DELETE FROM reservations WHERE id = $1', [id]);
  },

  // deleteUserReservations: This asynchronous function deletes all reservations for a specific user from the database. It uses the pool.query method to execute a SQL query that deletes all rows from the reservations table where the user_id matches the provided ID. If an error occurs, it logs the error and throws it.
  deleteUserReservations: async (userId) => {
    try {
      await pool.query('DELETE FROM reservations WHERE user_id = $1', [userId]);
    } catch (error) {
      console.error(
        'An error occurred while deleting the user reservations.',
        error,
      );
      throw error;
    }
  },

  // getUserReservations: This asynchronous function fetches all reservations for a specific user from the database. It uses the pool.query method to execute a SQL query that selects all columns from the reservations table where the user_id matches the provided ID. If an error occurs, it logs the error and throws it.
  getUserReservations: async (userId) => {
    try {
      const reservations = await pool.query(
        'SELECT * FROM reservations WHERE user_id = $1',
        [userId],
      );
      return reservations.rows;
    } catch (error) {
      console.error(
        'An error occurred while fetching the user reservations.',
        error,
      );
      throw error;
    }
  },
};

export default reservationModel;
