import express from 'express';

const app = express();

// Start the server
app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});