// Importing express module
import express from 'express';

import users from './users.json' assert { type: "json" };
import authors from './authors.json' assert { type: "json" };
import books from './books.json' assert { type: "json" };

// fs is a built-in module in Node.js for interacting with the file system
import fs from 'fs';
// path is a built-in module in Node.js for working with file paths
// { dirname } is a named export from the path module
import path, { dirname } from 'path';
// fileURLToPath is a built-in module in Node.js for converting a file URL to a file path
import { fileURLToPath } from 'url';
// __dirname is not available in ES6 modules because ES6 modules are loaded asynchronously
// and __dirname is only available synchronously
// __dirname is available in CommonJS modules
// CommonJS modules are loaded synchronously
const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

router.get('/users', (req, res) => {
	try {
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ message: 'An error occurred while retrieving users.' });
	}
});

router.post('/users/register', async (req, res) => {
	try {
		const newUser = {
			...req.body,
			registered_on: new Date().toISOString().split('T')[0], // Add registered_on field with current date
		};

		users.push(newUser);
		users.forEach((user, index) => {
			user.id = index + 1;
		});

		await fs.promises.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
		res.status(201).json(newUser);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'An error occurred while creating the user.' });
	}
});

router.post( "/users/login", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const user = users.find(user => user.username === username || user.email === email);

		if (!user) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		if (user.password !== password) {
			res.status(401).json({ message: 'Invalid password.' });
			return;
		}

		res.status(200).json({ message: 'Logged in successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'An error occurred while logging in.' });
	}
}) ;

router.get('/users/:id', (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const user = users.find(user => user.id === id);

		if (!user) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: 'An error occurred while retrieving the user.' });
	}
});

router.put('/users/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const updatedUser = { ...req.body, id }; // Preserve the id

		let userIndex = users.findIndex(user => user.id === id);
		if (userIndex === -1) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		// Keep the original registered_on date and reservations
		updatedUser.registered_on = users[userIndex].registered_on;
		updatedUser.reservations = users[userIndex].reservations;

		users[userIndex] = updatedUser;
		await fs.promises.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
		res.status(200).json(updatedUser);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'An error occurred while updating the user.' });
	}
});

router.patch('/users/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const updatedFields = req.body;

		let userIndex = users.findIndex(user => user.id === id);
		if (userIndex === -1) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		// Merge the updated fields with the existing user
		users[userIndex] = { ...users[userIndex], ...updatedFields };

		await fs.promises.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
		res.status(200).json(users[userIndex]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'An error occurred while updating the user.' });
	}
});

router.delete('/users/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);

		let userIndex = users.findIndex(user => user.id === id);
		if (userIndex === -1) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		// Remove the user from the array
		users.splice(userIndex, 1);

		await fs.promises.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
		res.status(200).json({ message: 'User deleted successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'An error occurred while deleting the user.' });
	}
});

router.get('/users/:id/reservations', (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const user = users.find(user => user.id === id);

		if (!user) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		// Find the books that the user has reserved
		const reservedBooks = books.filter(book => user.reservations.includes(book.id));

		// Create a new array that only includes the properties you want
		const reservedBooksInfo = reservedBooks.map(book => ({
			id: book.id,
			title: book.title,
			author: book.author,
			published_on: book.published_on
		}));

		// const reservedBooksInfo = reservedBooks.map(book => {
		// 	const bookCopy = { ...book };
		// 	delete bookCopy.quantity;
		// 	delete bookCopy.available;
		// 	return bookCopy;
		// });

		res.status(200).json(reservedBooksInfo);
	} catch (err) {
		res.status(500).json({ message: 'An error occurred while retrieving the user reservations.' });
	}
});

router.post('/users/:userId/reservations/:bookId', async (req, res) => {
	try {
		const userId = parseInt(req.params.userId);
		const bookId = parseInt(req.params.bookId);

		const user = users.find(user => user.id === userId);
		const book = books.find(book => book.id === bookId);

		if (!user || !book) {
			res.status(404).json({ message: 'User or book not found.' });
			return;
		}

		// Check if the user has already reserved the book
		if (user.reservations.includes(bookId)) {
			res.status(400).json({ message: 'Book is already reserved by the user.' });
			return;
		}

		// Check if the book is available
		if (book.quantity === 0 || !book.available) {
			res.status(400).json({ message: 'Book is not available.' });
			return;
		}

		// Add the book ID to the user's reservations
		user.reservations.push(bookId);

		// Decrease the quantity of the book
		book.quantity--;

		// If the quantity is now 0, mark the book as not available
		if (book.quantity === 0) {
			book.available = false;
		}

		// Write the updated users array back to the users.json file
		await fs.promises.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));

		// Write the updated books array back to the books.json file
		await fs.promises.writeFile(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2));

		res.status(200).json({ message: 'Book successfully reserved.' });
	} catch (err) {
		res.status(500).json({ message: 'An error occurred while creating the reservation.' });
	}
});

router.delete('/users/:userId/reservations/:bookId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const bookId = parseInt(req.params.bookId);

        const user = users.find(user => user.id === userId);
        const book = books.find(book => book.id === bookId);

        if (!user || !book) {
            res.status(404).json({ message: 'User or book not found.' });
            return;
        }

        // Check if the user has reserved the book
        const reservationIndex = user.reservations.indexOf(bookId);
        if (reservationIndex === -1) {
            res.status(400).json({ message: 'Book is not reserved by the user.' });
            return;
        }

        // Remove the book ID from the user's reservations
        user.reservations.splice(reservationIndex, 1);

        // Increase the quantity of the book
        book.quantity++;

        // Mark the book as available
        book.available = true;

        // Write the updated users array back to the users.json file
        await fs.promises.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));

        // Write the updated books array back to the books.json file
        await fs.promises.writeFile(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2));

        res.status(200).json({ message: 'Book successfully unreserved.' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while deleting the reservation.' });
    }
});

// Creating an express application
const app = express();

// express.json() is a built-in middleware function in Express
app.use(express.json());

// Use the router as middleware in your application
app.use('/api/v1/library', router);

// Have the app listen on a specific port
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running and listening on port ${port}`);
});