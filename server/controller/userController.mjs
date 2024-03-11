import bcrypt from 'bcrypt';

import userModel from '../model/userModel.mjs'; // Update this path to the path of your User model
import reservationModel from '../model/reservationModel.mjs';
import bookModel from '../model/bookModel.mjs';

const userController = {

	getUsers: async (req, res) => {
		try {
			const users = await userModel.getUsers(req.query.paginate, req.query.page, req.query.limit);

			res.status(200).json(users);
		} catch (err) {
			res.status(500).json({ message: 'An error occurred while fetching users.' });
		}
	},

	createUser: async (req, res) => {
		try {
			const { username, password, repeatPassword, email} = req.body;

			const existingUser = await userModel.getUserByEmail(email);
			if (existingUser) {
				res.status(400).json({ message: 'Email already exists.' });
				return;
			}

			if (password !== repeatPassword) {
				res.status(400).json({ message: 'Passwords do not match.' });
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = {
				username,
				password: hashedPassword,
				email,
				registered_on: new Date(),
				reservations: []
			};

			const createdUser = await userModel.createUser(newUser);

			res.status(201).json(createdUser);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while creating the user.' });
		}
	},

	login: async (req, res) => {
		try {
			
			const user = await userModel.login(req.body);
			
			res.status(200).json({ message: 'Logged in successfully.', user });	
		} catch (err) {
			if (err.message === 'User not found.' || err.message === 'Invalid credentials.') {
				res.status(401).json({ message: err.message });
			} else {
				res.status(500).json({ message: 'An error occurred while logging in.' });
			}
		}
	},

	getUserById: async (req, res) => {
		try {
			const id = req.params.id;
			const user = await userModel.getUserById(id);

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
			const id = req.params.id;
			const updatedUser = req.body;

			const email = req.body.email;

			const existingUser = await userModel.getUserByEmail(email);
			if (existingUser) {
				res.status(400).json({ message: 'Email already exists.' });
				return;
			}

			const user = await userModel.updateUser(id, updatedUser);

			if (!user) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while updating the user.' });
		}
	},

	updateUserFields: async (req, res) => {
		try {
			const id = req.params.id;
			const updatedFields = req.body;

			const user = await userModel.updateUserFields(id, updatedFields);

			if (!user) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while updating the user.' });
		}
	},

	deleteUser: async (req, res) => {
		try {
			const id = req.params.id;

			const user = await userModel.deleteUser(id);

			if (!user) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}

			res.status(200).json({ message: 'User deleted successfully.' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while deleting the user.' });
		}
	},

	getUserReservations: async (req, res) => {
		try {
			const id = req.params.id;
			const user = await userModel.getUserById(id);

			if (!user) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}

			const reservedBooks = await userModel.getUserReservations(id);

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
			const { book } = await userModel.createReservation(req.params);
			res.status(200).json({ message: 'Book successfully reserved.', book });
		} catch (err) {
			console.error(err); // Add this line
			if (err.message === 'User or book not found.' || err.message === 'Book is already reserved by the user.' || err.message === 'Book is not available.') {
				res.status(400).json({ message: err.message });
			} else {
				res.status(500).json({ message: 'An error occurred while creating the reservation.' });
			}
		}
	},

	deleteReservation: async (req, res) => {
		try {

			const userId = req.params.userId;
			const bookId = req.params.bookId;

			const user = await userModel.getUserById(userId);
			const book = await bookModel.getBookById(bookId);

			if (!user || !book) {
				res.status(404).json({ message: 'User or book not found.' });
				return;
			}

			const reservation = await reservationModel.getReservationByUserAndBook(userId, bookId);
			
			if (!reservation) {
				res.status(400).json({ message: 'Book is not reserved by the user.' });
				return;
			}

			await reservationModel.deleteReservation(reservation.id);

			await bookModel.incrementBookQuantity(bookId);

			await bookModel.updateBookAvailability(bookId, true);

			res.status(200).json({ message: 'Book successfully unreserved.' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while deleting the reservation.' });
		}
	}
};

export default userController;