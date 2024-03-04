import bcrypt from 'bcrypt';

import User from '../models/userSchema.mjs'; // Update this path to the path of your User model
import Book from '../models/bookSchema.mjs'; // Assuming you have a Book model

const userController = {

	getUsers: async (req, res) => {
		try {
			if (req.query.paginate === 'true') {
				const page = parseInt(req.query.page) || 1; // Default to page 1
				const limit = parseInt(req.query.limit) || 3; // Default to 3 items per page

				const users = await User.find()
					.skip((page - 1) * limit)
					.limit(limit);

				res.status(200).json(users);
			} else {
				const users = await User.find(); // Use Mongoose's find method to fetch all users
				res.status(200).json(users);
			}
		} catch (err) {
			res.status(500).json({ message: 'An error occurred while fetching users.' });
		}
	},

	createUser: async (req, res) => {
		try {
			const {password, repeatPassword , ...otherUserFields} = req.body;

			
			if (password !== repeatPassword) {
				res.status(400).json({ message: 'Passwords do not match.' });
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = new User({
				...otherUserFields,
				password: hashedPassword,
				reservations: []
			});

			await newUser.save(); // Use Mongoose's save method to save the new user to the database

			res.status(201).json(newUser);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while creating the user.' });
		}
	},

	getUserById: async (req, res) => {
		try {
			const id = req.params._id; // No need to parse as integer
			const user = await User.findById(id);

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
			const id = req.params._id;
			const updatedUser = { ...req.body, id };

			const user = await User.findByIdAndUpdate(id, updatedUser, { new: true, overwrite: true });

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
			const id = req.params._id;
			const updatedFields = req.body;

			const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });

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
			const id = req.params._id;

			const user = await User.findByIdAndDelete(id);

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
			const id = req.params._id;
			const user = await User.findById(id);

			if (!user) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}

			const reservedBooks = await Book.find({ '_id': { $in: user.reservations } });

			const reservedBooksInfo = reservedBooks.map(book => ({
				id: book._id,
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
			if (!req.user._id) {
				res.status(401).json({ message: 'Please log in.' });
				return;
			}

			const userId = req.user._id;
			const bookId = req.params.bookId;

			// console.log(`userId: ${userId}, bookId: ${bookId}`); // Debugging line

			// Fetch the user and the book from the database
			const user = await User.findById(userId);
			const book = await Book.findById(bookId);

			// console.log(`user: ${JSON.stringify(user)}, book: ${JSON.stringify(book)}`); // Debugging line

			if (!user || !book) {
				res.status(404).json({ message: 'User or book not found.' });
				return;
			}

			// Ensure that the reservations field is present
			if (!user.reservations) {
				user.reservations = [];
			}

			if (user.reservations && user.reservations.includes(bookId)) {
				res.status(400).json({ message: 'Book is already reserved by the user.' });
				return;
			}

			if (book.quantity === 0 || !book.available) {
				res.status(400).json({ message: 'Book is not available.' });
				return;
			}

			// In your createReservation function
			if (user.reservations) {
				user.reservations.addToSet(bookId);
				await user.save();
			} else {
				res.status(500).json({ message: 'User does not have a reservations field.' });
				return;
			}

			// console.log(`user after save: ${JSON.stringify(user)}`); // Debugging line

			// Decrease the book's quantity and update its availability if necessary
			book.quantity--;

			if (book.quantity === 0) {
				book.available = false;
			}

			await book.save();

			// console.log(`book after save: ${JSON.stringify(book)}`); // Debugging line

			res.status(200).json({ message: 'Book successfully reserved.' });
		} catch (err) {
			// console.log(err);
			res.status(500).json({ message: 'An error occurred while creating the reservation.' });
		}
	},

	deleteReservation: async (req, res) => {
		try {

			// Check if the user is logged in
			if (!req.user._id) {
				res.status(401).json({ message: 'Please log in.' });
				return;
			}

			const userId = req.params.userId;
			const bookId = req.params.bookId;

			// Check if the logged-in user is the same as the user making the reservation
			if (req.user.userId !== userId) {
				res.status(403).json({ message: 'You can only make reservations for yourself.' });
				return;
			}

			const user = await User.findById(userId);
			const book = await Book.findById(bookId);

			if (!user || !book) {
				res.status(404).json({ message: 'User or book not found.' });
				return;
			}

			const reservationIndex = user.reservations.indexOf(bookId);
			if (reservationIndex === -1) {
				res.status(400).json({ message: 'Book is not reserved by the user.' });
				return;
			}

			user.reservations.pull(bookId);
			await user.save();

			book.quantity++;

			book.available = true;

			await book.save();

			res.status(200).json({ message: 'Book successfully unreserved.' });
		} catch (err) {
			res.status(500).json({ message: 'An error occurred while deleting the reservation.' });
		}
	}
};

export default userController;