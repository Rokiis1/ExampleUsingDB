import { pool } from '../db/postgresConnection.mjs';

// createAuthor: This asynchronous function handles POST requests to create a new author. It extracts the name from the request body. It then uses the query method from the pool object (which represents a pool of database connections) to execute an SQL INSERT statement that adds a new author with the given name to the authors table in the database. The RETURNING * clause in the SQL statement means that the query will return all columns of the newly inserted row. If the query is successful, the new author is extracted from the result and sent in the response with HTTP status 201 (which indicates that a new resource was successfully created). If an error occurs during this process, a response with HTTP status 500 and an error message is sent.

const authorController = {
  createAuthor: async (req, res) => {
    try {
      const { name } = req.body;
      const result = await pool.query(
        'INSERT INTO authors(name) VALUES($1) RETURNING *',
        [name],
      );
      const author = result.rows[0];
      res.status(201).json(author);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'An error occurred while creating the author.' });
    }
  },
};

export default authorController;
