import { pool } from '../db/postgresConnection.mjs';

const authorModel = {
  // getAuthorById: This asynchronous function fetches an author by their ID from the database. It uses the pool.query method from the pg library to execute a SQL query that selects the author with the given ID from the authors table. If the author is not found (i.e., the query returns no rows), it throws an error with the message 'Author not found.'. If the author is found, it returns the first row of the result (which is the author).
  getAuthorById: async (author_id) => {
    const authorResult = await pool.query(
      'SELECT id FROM authors WHERE id = $1',
      [author_id],
    );
    if (authorResult.rows.length === 0) {
      throw new Error('Author not found.');
    }
    return authorResult.rows[0];
  },
};

export default authorModel;
