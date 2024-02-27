import users from '../../db/users.json' assert { type: "json" };
import books from '../../db/books.json' assert { type: "json" };
import authors from '../../db/authors.json' assert { type: "json" };

import fs from 'fs';

import path, { dirname } from 'path';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const userController = {

	getUsers: (req, res) => {
        try {
            // const paginatedUsers = users.slice(start, end);
            // {{BASE_URI}}/users?paginate=true&page=1&limit=3
            if (req.query.paginate === 'true') {
                const page = parseInt(req.query.page) || 1; // Default to page 1
                const limit = parseInt(req.query.limit) || 3; // Default to 10 items per page
                // start - (page - 1) * limit = 0 - (1 - 1) * 3 = 0
                // Why do we need to subtract 1 from page?
                // If page is 1, we want to start at 0
                const start = (page - 1) * limit;
                const end = page * limit;
    
                const paginatedUsers = users.slice(start, end);
    
                res.status(200).json(paginatedUsers);
            } else {
                res.status(200).json(users);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while retrieving users.' });
        }
    },

    createUser: async (req, res) => {
        try {
            const newUser = {
                ...req.body,
                registered_on: new Date().toISOString().split('T')[0], 
                reservations: []
            };

            users.push(newUser);
            users.forEach((user, index) => {
                user.id = index + 1;
            });

            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));
            res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while creating the user.' });
        }
    },

    login: async (req, res) => {
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
    },

    getUserById: (req, res) => {
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
    },

    updateUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updatedUser = { ...req.body, id };
    
            let userIndex = users.findIndex(user => user.id === id);
    
            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }
    
            updatedUser.registered_on = users[userIndex].registered_on;
            updatedUser.reservations = users[userIndex].reservations;
    
            users[userIndex] = updatedUser;
            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));
            res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while updating the user.' });
        }
    },

    updateUserFields: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updatedFields = req.body;

            const userIndex = users.findIndex(user => user.id === id);

            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            // Merge the updated fields with the existing user
            users[userIndex] = { ...users[userIndex], ...updatedFields };

            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));
            res.status(200).json(users[userIndex]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while updating the user.' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
    
            let userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }
    
            // Remove the user from the array
            users.splice(userIndex, 1);
    
            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));
            res.status(200).json({ message: 'User deleted successfully.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while deleting the user.' });
        }
    },

    getUserReservations: (req, res) => {
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
    },

    createReservation: async (req, res) => {
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
            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));
    
            // Write the updated books array back to the books.json file
            await fs.promises.writeFile(path.join(__dirname, '../../db/books.json'), JSON.stringify(books, null, 2));
    
            res.status(200).json({ message: 'Book successfully reserved.' });
        } catch (err) {
            res.status(500).json({ message: 'An error occurred while creating the reservation.' });
        }
    },

    deleteReservation: async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);
    
            const user = users.find(user => user.id === userId);
            const book = books.find(book => book.id === bookId);
    
            if (!user || !book) {
                res.status(404).json({ message: 'User or book not found.' });
                return;
            }
    
            const reservationIndex = user.reservations.indexOf(bookId);
            if (reservationIndex === -1) {
                res.status(400).json({ message: 'Book is not reserved by the user.' });
                return;
            }
    
            user.reservations.splice(reservationIndex, 1);
    
            book.quantity++;

            book.available = true;
    
            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));
    
            await fs.promises.writeFile(path.join(__dirname, '../../db/books.json'), JSON.stringify(books, null, 2));
    
            res.status(200).json({ message: 'Book successfully unreserved.' });
        } catch (err) {
            res.status(500).json({ message: 'An error occurred while deleting the reservation.' });
        }
    }
};

export default userController;