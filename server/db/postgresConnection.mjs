// Importing necessary modules: The pg module is used to interact with PostgreSQL databases in Node.js. dotenv is used to load environment variables from a .env file.
import pg from 'pg';
import dotenv from 'dotenv';

// Environment configuration: Depending on whether the environment is production (prod) or not, different environment variables are loaded.

if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.dev' });
}

// SSL configuration: If the PGSSLMODE environment variable is set to require, SSL is enabled with rejectUnauthorized set to false. This means the server's SSL certificate isn't verified against the list of supplied CAs.

const ssl =
  process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false;

// console.log('PGSSLMODE:', process.env.PGSSLMODE);
// console.log('ssl:', ssl);

const { Pool } = pg;

// Creating a new pool: A pool is a set of connections to the database that are kept open and reused for future requests, rather than opening a new connection each time. This is more efficient than opening and closing a new connection for every interaction with the database.

export const pool = new Pool({
  // Pool configuration: The pool is configured with details about the database and connection limits. These details include the user, host, database name, password, and port for the database, as well as the maximum number of clients in the pool, connection timeout, idle timeout, and SSL settings.
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  ssl,
});

// Connecting to the database: The connectDB function is defined to connect to the database. It returns a promise that resolves with a success message if the connection is successful, or rejects with an error if the connection fails. This function can be used elsewhere in the code to initiate the database connection.
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
