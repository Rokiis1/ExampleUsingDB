// Importing express module
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import userController from '../controller/userController.mjs';
import { userValidationSchema, updateUserFieldsValidationSchema, validateReservationParams, validateUserId, loginValidationSchema } from '../validators/userValidator.mjs';
import { validate } from '../middleware/schemaValidator.mjs';
import passport from '../strategies/auth.mjs';
import { isAdmin, isUser } from '../middleware/roleCheck.mjs';

dotenv.config();

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, userController.getUsers);

router.post('/register', validate(userValidationSchema) , userController.createUser);

router.post('/login', validate(loginValidationSchema) , passport.authenticate('local', { session: false }), (req, res) => {
	const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
	res.status(200).json({ message: 'Logged in successfully.', token });
});

router.get('/:_id', passport.authenticate('jwt', { session: false }), validate(validateUserId), userController.getUserById);

router.put('/:_id', passport.authenticate('jwt', { session: false }), validate(validateUserId, userValidationSchema) , userController.updateUser);

router.patch('/:_id', passport.authenticate('jwt', { session: false }), validate(validateUserId, updateUserFieldsValidationSchema) , userController.updateUserFields);

router.delete('/:_id', passport.authenticate('jwt', { session: false }), validate(validateUserId) , userController.deleteUser);

router.get('/:_id/reservations', passport.authenticate('jwt', { session: false }) ,validate(validateUserId) , userController.getUserReservations);

router.post('/:userId/reservations/:bookId', passport.authenticate('jwt', { session: false }), validate(validateReservationParams) , isUser, userController.createReservation);

router.delete('/:userId/reservations/:bookId', passport.authenticate('jwt', { session: false }), validate(validateReservationParams) , userController.deleteReservation);

export default router;