// Routes index file that imports and uses the user, book, and author routers to define the API routes. The index file exports the router object, which is used to define the API routes in the server.
import express from 'express';

import usersRouter from './users.mjs';
import booksRouter from './books.mjs';
import authorsRouter from './authors.mjs';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);

export default router;
