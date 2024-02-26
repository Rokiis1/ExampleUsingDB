import express from 'express';

import usersRouter from './routes/index.mjs';
import session from './middleware/session.mjs';
import cookies from './middleware/cookies.mjs';

const app = express();

// The user's ID is stored in the session on the server.
// The session ID is stored as a cookie on the client.
// The session ID is used to look up the session data on the server.
// The user's ID is used to look up the user in the user table.

app.use(cookies);
app.use(session);

app.use(express.json());

app.use('/api/v1/library', usersRouter);

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running and listening on port ${port}`);
});