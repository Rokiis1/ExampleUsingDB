import bcrypt from 'bcrypt';

import userModel from '../models/userModel.mjs'; // Update this path to the path of your User model
import reservationModel from '../models/reservationModel.mjs';
import bookModel from '../models/bookModel.mjs';

const userController = {
  // getUsers: This asynchronous function handles GET requests to fetch all users. It uses the getUsers method from the userModel to fetch the users from the database. If successful, it sends a response with HTTP status 200 and the list of users. If an error occurs, it sends a response with HTTP status 500 and an error message.
  getUsers: async (req, res) => {
    try {
      const users = await userModel.getUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: 'An error occurred while fetching users.' });
    }
  },

  // getPaginatedUsers: This asynchronous function handles GET requests to fetch a paginated list of users. It uses the getPaginatedUsers method from the userModel to fetch the users from the database. If successful, it sends a response with HTTP status 200 and the list of users. If an error occurs, it sends a response with HTTP status 500 and an error message.
  getPaginatedUsers: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const users = await userModel.getPaginatedUsers(page, limit);
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: 'An error occurred while fetching users.' });
    }
  },

  // createUser: This asynchronous function handles POST requests to create a new user. It first checks if the email already exists in the database. If it does, it sends a response with HTTP status 400 and an error message. If the passwords do not match, it sends a response with HTTP status 400 and an error message. If the email does not exist and the passwords match, it hashes the password and creates a new user in the database. If successful, it sends a response with HTTP status 201 and the created user. If an error occurs, it sends a response with HTTP status 500 and an error message.
  createUser: async (req, res) => {
    try {
      const {
        username,
        password,
        repeatPassword,
        email,
        role = 'user',
      } = req.body;

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
        reservations: [],
        role,
      };

      const createdUser = await userModel.createUser(newUser);

      res.status(201).json(createdUser);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: 'An error occurred while creating the user.' });
    }
  },

  // getUserById: This asynchronous function handles GET requests to fetch a user by their ID. It uses the getUserById method from the userModel to fetch the user from the database. If the user is not found, it sends a response with HTTP status 404 and an error message. If the user is found, it sends a response with HTTP status 200 and the user. If an error occurs, it sends a response with HTTP status 500 and an error message.
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
      res
        .status(500)
        .json({ message: 'An error occurred while retrieving the user.' });
    }
  },

  // updateUser: This asynchronous function handles PUT requests to update a user. It first checks if the email already exists in the database. If it does, it sends a response with HTTP status 400 and an error message. If the email does not exist, it uses the updateUser method from the userModel to update the user in the database. If the user is not found, it sends a response with HTTP status 404 and an error message. If the user is found and updated, it sends a response with HTTP status 200 and the updated user. If an error occurs, it sends a response with HTTP status 500 and an error message.
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
      res
        .status(500)
        .json({ message: 'An error occurred while updating the user.' });
    }
  },

  // updateUserFields: This asynchronous function handles PATCH requests to update specific fields of a user. It uses the updateUserFields method from the userModel to update the user in the database. If the user is not found, it sends a response with HTTP status 404 and an error message. If the user is found and updated, it sends a response with HTTP status 200 and the updated user. If an error occurs, it sends a response with HTTP status 500 and an error message.
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
      res
        .status(500)
        .json({ message: 'An error occurred while updating the user.' });
    }
  },

  // deleteUser: This asynchronous function handles DELETE requests to delete a user. It first fetches the user's reservations, makes the books associated with the reservations available again, deletes the user's reservations, and then deletes the user. If the user is not found, it sends a response with HTTP status 404 and an error message. If the user is found and deleted, it sends a response with HTTP status 200 and a success message. If an error occurs, it sends a response with HTTP status 500 and an error message.
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;

      // Get the user's reservations
      const reservations = await reservationModel.getUserReservations(id);

      // Make the books associated with the reservations available again
      await bookModel.returnUserBooks(reservations);

      // Delete the user's reservations
      await reservationModel.deleteUserReservations(id);

      // Delete the user
      const user = await userModel.deleteUser(id);

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: 'An error occurred while deleting the user.' });
    }
  },

  // getUserReservations: This asynchronous function handles GET requests to fetch a user's reservations. It uses the getUserReservations method from the userModel to fetch the reservations from the database. If the user is not found, it sends a response with HTTP status 404 and an error message. If the user is found, it sends a response with HTTP status 200 and the user's reservations. If an error occurs, it sends a response with HTTP status 500 and an error message.
  getUserReservations: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userModel.getUserById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      const reservedBooks = await userModel.getUserReservations(id);

      const reservedBooksInfo = reservedBooks.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        published_on: book.published_on,
      }));

      res.status(200).json(reservedBooksInfo);
    } catch (err) {
      res.status(500).json({
        message: 'An error occurred while retrieving the user reservations.',
      });
    }
  },

  // createReservation: This asynchronous function handles POST requests to create a new reservation for a user. It first checks if the user and book exist and if the book is available. If any of these conditions are not met, it sends a response with HTTP status 400 and an error message. If the conditions are met, it creates a new reservation, decreases the book quantity, and sends a response with HTTP status 200 and a success message. If an error occurs, it sends a response with HTTP status 500 and an error message.
  createReservation: async (req, res) => {
    try {
      const user = await userModel.getUserById(req.params.userId);
      const book = await bookModel.getBookById(req.params.bookId);

      if (!user || !book) {
        throw new Error('User or book not found.');
      }

      const existingReservation =
        await reservationModel.getReservationByUserAndBook(
          req.params.userId,
          req.params.bookId,
        );

      if (existingReservation) {
        throw new Error('Book is already reserved by the user.');
      }

      if (book.quantity === 0 || !book.available) {
        throw new Error('Book is not available.');
      }

      await reservationModel.createReservation(
        req.params.userId,
        req.params.bookId,
      );

      // Decrease book quantity
      await bookModel.decrementBookQuantity(req.params.bookId);

      res.status(200).json({ message: 'Book successfully reserved.', book });
    } catch (err) {
      if (
        err.message === 'User or book not found.' ||
        err.message === 'Book is already reserved by the user.' ||
        err.message === 'Book is not available.'
      ) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({
          message: 'An error occurred while creating the reservation.',
        });
      }
    }
  },

  // deleteReservation: This asynchronous function handles DELETE requests to delete a reservation. It first checks if the user, book, and reservation exist. If any of these conditions are not met, it sends a response with HTTP status 400 or 404 and an error message. If the conditions are met, it deletes the reservation, increments the book quantity, updates the book availability, and sends a response with HTTP status 200 and a success message. If an error occurs, it sends a response with HTTP status 500 and an error message.
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

      const reservation = await reservationModel.getReservationByUserAndBook(
        userId,
        bookId,
      );

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
      res
        .status(500)
        .json({ message: 'An error occurred while deleting the reservation.' });
    }
  },
};

export default userController;
