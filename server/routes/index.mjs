// Importing express module
import express from 'express';

import usersRouter from './users.mjs';
import booksRouter from './books.mjs';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/books', booksRouter);

export default router;