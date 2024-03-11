import bcrypt from 'bcrypt';

import userModel from '../model/userModel.mjs'; // Update this path to the path of your User model

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

	// getUserById: async (req, res) => {
	// 	try {
	// 		const id = req.params._id; // No need to parse as integer
	// 		const user = await User.findById(id);

	// 		if (!user) {
	// 			res.status(404).json({ message: 'User not found.' });
	// 			return;
	// 		}

	// 		res.status(200).json(user);
	// 	} catch (err) {
	// 		res.status(500).json({ message: 'An error occurred while retrieving the user.' });
	// 	}
	// },

	// updateUser: async (req, res) => {
	// 	try {
	// 		const id = req.params._id;
	// 		const updatedUser = { ...req.body, id };

	// 		const user = await User.findByIdAndUpdate(id, updatedUser, { new: true, overwrite: true });

	// 		if (!user) {
	// 			res.status(404).json({ message: 'User not found.' });
	// 			return;
	// 		}

	// 		res.status(200).json(user);
	// 	} catch (err) {
	// 		console.error(err);
	// 		res.status(500).json({ message: 'An error occurred while updating the user.' });
	// 	}
	// },

	// updateUserFields: async (req, res) => {
	// 	try {
	// 		const id = req.params._id;
	// 		const updatedFields = req.body;

	// 		const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });

	// 		if (!user) {
	// 			res.status(404).json({ message: 'User not found.' });
	// 			return;
	// 		}

	// 		res.status(200).json(user);
	// 	} catch (err) {
	// 		console.error(err);
	// 		res.status(500).json({ message: 'An error occurred while updating the user.' });
	// 	}
	// },

	// deleteUser: async (req, res) => {
	// 	try {
	// 		const id = req.params._id;

	// 		const user = await User.findByIdAndDelete(id);

	// 		if (!user) {
	// 			res.status(404).json({ message: 'User not found.' });
	// 			return;
	// 		}

	// 		res.status(200).json({ message: 'User deleted successfully.' });
	// 	} catch (err) {
	// 		console.error(err);
	// 		res.status(500).json({ message: 'An error occurred while deleting the user.' });
	// 	}
	// },

	// getUserReservations: async (req, res) => {
	// 	try {
	// 		const id = req.params._id;
	// 		const user = await User.findById(id);

	// 		if (!user) {
	// 			res.status(404).json({ message: 'User not found.' });
	// 			return;
	// 		}

	// 		const reservedBooks = await Book.find({ '_id': { $in: user.reservations } });

	// 		const reservedBooksInfo = reservedBooks.map(book => ({
	// 			id: book._id,
	// 			title: book.title,
	// 			author: book.author,
	// 			published_on: book.published_on
	// 		}));

	// 		res.status(200).json(reservedBooksInfo);
	// 	} catch (err) {
	// 		res.status(500).json({ message: 'An error occurred while retrieving the user reservations.' });
	// 	}
	// },

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

	// deleteReservation: async (req, res) => {
	// 	try {

	// 		// Check if the user is logged in
	// 		if (!req.session.userId) {
	// 			res.status(401).json({ message: 'Please log in.' });
	// 			return;
	// 		}

	// 		const userId = req.params.userId;
	// 		const bookId = req.params.bookId;

	// 		// Check if the logged-in user is the same as the user making the reservation
	// 		if (req.session.userId !== userId) {
	// 			res.status(403).json({ message: 'You can only make reservations for yourself.' });
	// 			return;
	// 		}

	// 		const user = await User.findById(userId);
	// 		const book = await Book.findById(bookId);

	// 		if (!user || !book) {
	// 			res.status(404).json({ message: 'User or book not found.' });
	// 			return;
	// 		}

	// 		const reservationIndex = user.reservations.indexOf(bookId);
	// 		if (reservationIndex === -1) {
	// 			res.status(400).json({ message: 'Book is not reserved by the user.' });
	// 			return;
	// 		}

	// 		user.reservations.pull(bookId);
	// 		await user.save();

	// 		book.quantity++;

	// 		book.available = true;

	// 		await book.save();

	// 		res.status(200).json({ message: 'Book successfully unreserved.' });
	// 	} catch (err) {
	// 		res.status(500).json({ message: 'An error occurred while deleting the reservation.' });
	// 	}
	// }
};

export default userController;