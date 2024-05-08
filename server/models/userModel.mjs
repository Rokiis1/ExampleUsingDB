import bcrypt from 'bcrypt';

import { pool } from '../db/postgresConnection.mjs';

const userModel = {
  // getUsers: This asynchronous function fetches all users from the database. It uses the pool.query method from the pg library to execute a SQL query that selects all columns from the users table, ordered by id.
  getUsers: async () => {
    try {
      const users = await pool.query('SELECT * FROM users ORDER BY id');
      return users.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // getPaginatedUsers: This asynchronous function fetches a page of users from the database. It uses the pool.query method to execute a SQL query that selects all columns from the users table, offset by (page - 1) * limit and limited by limit.
  getPaginatedUsers: async (page, limit) => {
    try {
      const users = await pool.query('SELECT * FROM users OFFSET $1 LIMIT $2', [
        (page - 1) * limit,
        limit,
      ]);
      return users.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // createUser: This asynchronous function creates a new user in the database. It uses the pool.query method to execute a SQL query that inserts a new row into the users table with the provided user data, and returns the newly created user.
  createUser: async (newUser) => {
    try {
      const {
        username,
        password,
        email,
        registered_on,
        role = 'user',
      } = newUser;

      const result = await pool.query(
        'INSERT INTO users (username, password, email, registered_on, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, password, email, registered_on, role],
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // getUserByEmail: This asynchronous function fetches a user by their email from the database. It uses the pool.query method to execute a SQL query that selects all columns from the users table where the email matches the provided email.
  getUserByEmail: async ({ email }) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Login: This asynchronous function fetches a user by their username or email from the database. It uses the pool.query method to execute a SQL query that selects all columns from the users table where the username or email matches the provided username or email.
  login: async ({ username, email }) => {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email],
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found.');
    }

    const user = userResult.rows[0];

    return user;
  },

  // getUserById: This asynchronous function fetches a user by their ID from the database. It uses the pool.query method to execute a SQL query that selects all columns from the users table where the id matches the provided ID.
  getUserById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // getUserReservations: This asynchronous function fetches all reservations for a specific user from the database. It uses the pool.query method to execute a SQL query that selects all columns from the books table, joining the reservations and users tables, where the user_id matches the provided ID.
  getUserReservations: async (userId) => {
    const result = await pool.query(
      'SELECT books.* FROM users JOIN reservations ON users.id = reservations.user_id JOIN books ON reservations.book_id = books.id WHERE users.id = $1',
      [userId],
    );
    return result.rows;
  },

  // updateUser: This asynchronous function updates a user by their ID in the database. It first hashes the provided password using bcrypt, then uses the pool.query method to execute a SQL query that updates the username, password, and email columns in the users table where the id matches the provided ID, and returns the updated user.
  updateUser: async (id, updatedUser) => {
    const { username, password, email } = updatedUser;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const result = await pool.query(
      'UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING *',
      [username, hashedPassword, email, id],
    );
    return result.rows[0];
  },

  // updateUserFields: This asynchronous function updates specific fields of a user by their ID in the database. It generates a SET clause for the SQL query from the provided fields, then uses the pool.query method to execute a SQL query that updates the specified fields in the users table where the id matches the provided ID, and returns the updated user.
  updateUserFields: async (id, updatedFields) => {
    const setFields = Object.keys(updatedFields)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    const values = Object.values(updatedFields);
    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${setFields} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    return result.rows[0];
  },

  // deleteUser: This asynchronous function deletes a user by their ID from the database. It uses the pool.query method to execute a SQL query that deletes the row from the users table where the id matches the provided ID, and returns the deleted user. If an error occurs, it logs the error and throws it.
  deleteUser: async (userId) => {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [userId],
      );
      return result.rows[0];
    } catch (error) {
      console.error('An error occurred while deleting the user.', error);
      throw error;
    }
  },
};

export default userModel;
