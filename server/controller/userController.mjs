import User from '../model/userSchema.mjs'; // Update this path to the path of your User model
import Session from '../model/sessionSchema.mjs'; // Assuming you have a Session model

const userController = {

	getUsers: async (req, res) => {
		try {
			const users = await User.find(); // Use Mongoose's find method to fetch all users
			res.status(200).json(users);
		} catch (err) {
			res.status(500).json({ message: 'An error occurred while fetching users.' });
		}
	},

	createUser: async (req, res) => {
		try {
			const newUser = new User({
				...req.body,
				reservations: []
			});

			await newUser.save(); // Use Mongoose's save method to save the new user to the database

			res.status(201).json(newUser);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while creating the user.' });
		}
	},

	login: async (req, res) => {
		try {
			const { username, email, password } = req.body;

			// Use Mongoose's findOne method to find the user in the database
			const user = await User.findOne({ $or: [{ username }, { email }] });

			if (!user) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}

			// You should hash your passwords and compare the hashed values
			// For simplicity, we're comparing the plain text passwords here
			if (user.password !== password) {
				res.status(401).json({ message: 'Invalid password.' });
				return;
			}

			// Store the user's ID in the session
			req.session.userId = user._id;

			res.status(200).json({ message: 'Logged in successfully.' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'An error occurred while logging in.' });
		}
	},

	logout: async (req, res) => {
		try {
			// Check if the session exists
			if (!req.session.userId) {
				res.status(400).json({ message: 'No active session.' });
				return;
			}
			// Destroy the session in MongoDB
			await Session.findByIdAndDelete(req.sessionID);


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

	// getUserReservations: (req, res) => {
	//     try {
	//         const id = parseInt(req.params.id);
	//         const user = users.find(user => user.id === id);

	//         if (!user) {
	//             res.status(404).json({ message: 'User not found.' });
	//             return;
	//         }

	//         const reservedBooks = books.filter(book => user.reservations.includes(book.id));

	//         const reservedBooksInfo = reservedBooks.map(book => ({
	//             id: book.id,
	//             title: book.title,
	//             author: book.author,
	//             published_on: book.published_on
	//         }));

	//         res.status(200).json(reservedBooksInfo);
	//     } catch (err) {
	//         res.status(500).json({ message: 'An error occurred while retrieving the user reservations.' });
	//     }
	// },

	// createReservation: async (req, res) => {
	//     try {

	//         // Check if the user is logged in
	//         if (!req.session.userId) {
	//             res.status(401).json({ message: 'Please log in.' });
	//             return;
	//         }

	//         const userId = parseInt(req.params.userId);
	//         const bookId = parseInt(req.params.bookId);

	//         // Check if the logged-in user is the same as the user making the reservation
	//         if (req.session.userId !== userId) {
	//             res.status(403).json({ message: 'You can only make reservations for yourself.' });
	//             return;
	//         }

	//         const user = users.find(user => user.id === userId);
	//         const book = books.find(book => book.id === bookId);

	//         if (!user || !book) {
	//             res.status(404).json({ message: 'User or book not found.' });
	//             return;
	//         }

	//         if (user.reservations.includes(bookId)) {
	//             res.status(400).json({ message: 'Book is already reserved by the user.' });
	//             return;
	//         }

	//         if (book.quantity === 0 || !book.available) {
	//             res.status(400).json({ message: 'Book is not available.' });
	//             return;
	//         }

	//         user.reservations.push(bookId);

	//         book.quantity--;

	//         if (book.quantity === 0) {
	//             book.available = false;
	//         }

	//         await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));

	//         await fs.promises.writeFile(path.join(__dirname, '../../db/books.json'), JSON.stringify(books, null, 2));

	//         res.status(200).json({ message: 'Book successfully reserved.' });
	//     } catch (err) {
	//         res.status(500).json({ message: 'An error occurred while creating the reservation.' });
	//     }
	// },

	// deleteReservation: async (req, res) => {
	//     try {

	//         // Check if the user is logged in
	//         if (!req.session.userId) {
	//             res.status(401).json({ message: 'Please log in.' });
	//             return;
	//         }

	//         const userId = parseInt(req.params.userId);
	//         const bookId = parseInt(req.params.bookId);

	//         // Check if the logged-in user is the same as the user making the reservation
	//         if (req.session.userId !== userId) {
	//             res.status(403).json({ message: 'You can only make reservations for yourself.' });
	//             return;
	//         }

	//         const user = users.find(user => user.id === userId);
	//         const book = books.find(book => book.id === bookId);

	//         if (!user || !book) {
	//             res.status(404).json({ message: 'User or book not found.' });
	//             return;
	//         }

	//         const reservationIndex = user.reservations.indexOf(bookId);
	//         if (reservationIndex === -1) {
	//             res.status(400).json({ message: 'Book is not reserved by the user.' });
	//             return;
	//         }

	//         user.reservations.splice(reservationIndex, 1);

	//         book.quantity++;

	//         book.available = true;

	//         await fs.promises.writeFile(path.join(__dirname, '../../db/users.json'), JSON.stringify(users, null, 2));

	//         await fs.promises.writeFile(path.join(__dirname, '../../db/books.json'), JSON.stringify(books, null, 2));

	//         res.status(200).json({ message: 'Book successfully unreserved.' });
	//     } catch (err) {
	//         res.status(500).json({ message: 'An error occurred while deleting the reservation.' });
	//     }
	// }
};

export default userController;