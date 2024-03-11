import express from 'express';

import authorsController from '../controller/authorsController.mjs';

const router = express.Router();

router.post('/', authorsController.createAuthor);

export default router;