import express from 'express';

import usersRouter from './routes/index.mjs';

const app = express();

app.use(express.json());

app.use('/api/v1/library', usersRouter);

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running and listening on port ${port}`);
});