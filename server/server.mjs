// Importing express module
import express from 'express';

// Creating an express application
const app = express();

// Have the app listen on a specific port
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running and listening on port ${port}`);
});