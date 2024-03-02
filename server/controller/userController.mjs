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
            if (req.query.paginate === 'true') {
                const page = parseInt(req.query.page) || 1; // Default to page 1
                const limit = parseInt(req.query.limit) || 3; // Default to 10 items per page

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

            // if (user.password !== password) {
            //     res.status(401).json({ message: 'Invalid password.' });
            //     return;
            // }

			if (user.username !== username || user.email !== email || user.password !== password) {
				res.status(401).json({ message: 'Invalid credentials.' });
				return;
			}

            // Store the user's ID in the session
            req.session.userId = user.id;

            res.status(200).json({ message: 'Logged in successfully.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while logging in.' });
        }
    },

    logout: (req, res) => {
        try {
            // Check if the session exists
            if (!req.session.userId) {
                res.status(400).json({ message: 'No active session.' });
                return;
            }
    
            // Destroy the session
            req.session.destroy(err => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'An error occurred while logging out.' });
                    return;
                }
    
                // Send a successful logout message
                res.status(200).json({ message: 'Logged out successfully.' });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while logging out.' });
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

            const reservedBooks = books.filter(book => user.reservations.includes(book.id));

            const reservedBooksInfo = reservedBooks.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                published_on: book.published_on
            }));

            res.status(200).json(reservedBooksInfo);
        } catch (err) {
            res.status(500).json({ message: 'An error occurred while retrieving the user reservations.' });
        }
    },

    createReservation: async (req, res) => {
        try {

            // Check if the user is logged in
            if (!req.session.userId) {
                res.status(401).json({ message: 'Please log in.' });
                return;
            }

            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);

            // Check if the logged-in user is the same as the user making the reservation
            if (req.session.userId !== userId) {
                res.status(403).json({ message: 'You can only make reservations for yourself.' });
                return;
            }

            const user = users.find(user => user.id === userId);
            const book = books.find(book => book.id === bookId);

            if (!user || !book) {
                res.status(404).json({ message: 'User or book not found.' });
                return;
            }

            if (user.reservations.includes(bookId)) {
                res.status(400).json({ message: 'Book is already reserved by the user.' });
                return;
            }

            if (book.quantity === 0 || !book.available) {
                res.status(400).json({ message: 'Book is not available.' });
                return;
            }

            user.reservations.push(bookId);

            book.quantity--;

            if (book.quantity === 0) {
                book.available = false;
            }

            await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));

            await fs.promises.writeFile(path.join(__dirname, '../../db/books.json'), JSON.stringify(books, null, 2));

            res.status(200).json({ message: 'Book successfully reserved.' });
        } catch (err) {
            res.status(500).json({ message: 'An error occurred while creating the reservation.' });
        }
    },

    deleteReservation: async (req, res) => {
        try {

            // Check if the user is logged in
            if (!req.session.userId) {
                res.status(401).json({ message: 'Please log in.' });
                return;
            }

            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);

            // Check if the logged-in user is the same as the user making the reservation
            if (req.session.userId !== userId) {
                res.status(403).json({ message: 'You can only make reservations for yourself.' });
                return;
            }

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