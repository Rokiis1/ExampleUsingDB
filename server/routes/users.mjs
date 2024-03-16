// Importing express module
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import userController from '../controller/userController.mjs';

import { userValidationSchema, loginValidationSchema, validateReservationParams, validateUserId, updateUserFieldsValidationSchema } from '../validators/userValidator.mjs';

import { validate } from '../middleware/schemaValidator.mjs';
import passport from '../strategies/auth.mjs';
import { isAdmin, isUser } from '../middleware/roleCheck.mjs';

dotenv.config();

const router = express.Router();

router.get('/', isAdmin , userController.getUsers);

router.post('/register', validate(userValidationSchema) , userController.createUser);

router.post('/login', validate(loginValidationSchema) , passport.authenticate('local', { session: false }), isUser , (req, res) => {
	const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
	res.status(200).json({ message: 'Logged in successfully.', token });
} , userController.login);

router.get('/:id', validate(validateUserId), isUser, userController.getUserById);

router.put('/:id', validate(validateUserId, isUser, userValidationSchema) , userController.updateUser);

router.patch('/:id', validate(validateUserId, isUser, updateUserFieldsValidationSchema) , userController.updateUserFields);

router.delete('/:id', validate(validateUserId), isUser, userController.deleteUser);

router.get('/:id/reservations', validate(validateUserId), isUser, userController.getUserReservations);

router.post('/:userId/reservations/:bookId', validate(validateReservationParams), isUser, userController.createReservation);

router.delete('/:userId/reservations/:bookId', validate(validateReservationParams), isUser, userController.deleteReservation);

export default router;