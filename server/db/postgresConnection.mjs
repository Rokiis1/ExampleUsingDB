import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'LibraryDB',
	password: 'admin',
	port: 5432,
	max: 20,
	connectionTimeoutMillis: 2000,
	idleTimeoutMillis: 30000,
});

// const connectDB = () => {
// 	pool.connect((err) => {
// 		if (err) {
// 			console.error('connection error', err.stack);
// 		}
// 	});
// };

export const connectDB = () => {
	return new Promise((resolve, reject) => {
		pool.connect((err) => {
			if (err) {
				console.error('connection error', err.stack);
				reject(err);
			} else {
				resolve('Database connected successfully');
			}
		});
	});
};
