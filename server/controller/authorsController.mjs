import { pool } from '../db/postgresConnection.mjs';

const authorController = {
	createAuthor: async (req, res) => {
		try {
			const { name } = req.body;
			const result = await pool.query('INSERT INTO authors(name) VALUES($1) RETURNING *', [name]);
			const author = result.rows[0];
			res.status(201).json(author);
		} catch (err) {
			res.status(500).json({ message: 'An error occurred while creating the author.' });
		}
	}
};

export default authorController;