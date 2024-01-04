import express from 'express';

import booksController from '../controllers/booksController.mjs';

const router = express.Router();

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);
router.patch('/:id', booksController.patchBook);

export default router;