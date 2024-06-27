// Importing express module
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import userController from '../controller/userController.mjs';

import {
  userValidationSchema,
  loginValidationSchema,
  validateReservationParams,
  validateUserId,
  updateUserFieldsValidationSchema,
} from '../validators/userValidator.mjs';

import { validate } from '../middleware/schemaValidator.mjs';
import { validationResult } from 'express-validator';
import passport from '../strategies/auth.mjs';
import { isAdmin, isUser } from '../middleware/roleCheck.mjs';

dotenv.config();

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.getUsers,
);

router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.getPaginatedUsers,
);

router.post(
  '/register',
  userValidationSchema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.createUser,
);

router.post(
  '/login',
  validate(loginValidationSchema),
  passport.authenticate('local', { session: false }),
  isUser,
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res.status(200).json({ message: 'Logged in successfully.', token });
  },
  // userController.login,
);

router.get(
  '/:id',
  validate(validateUserId),
  passport.authenticate('jwt', { session: false }),
  isUser,
  userController.getUserById,
);

router.put(
  '/:id',
  validate(validateUserId, userValidationSchema),
  passport.authenticate('jwt', { session: false }),
  isUser,
  userController.updateUser,
);

router.patch(
  '/:id',
  validate(validateUserId, updateUserFieldsValidationSchema),
  passport.authenticate('jwt', { session: false }),
  isUser,
  userController.updateUserFields,
);

router.delete(
  '/:id',
  validate(validateUserId),
  passport.authenticate('jwt', { session: false }),
  isUser,
  userController.deleteUser,
);

router.get(
  '/:id/reservations',
  validate(validateUserId),
  passport.authenticate('jwt', { session: false }),
  isUser,
  userController.getUserReservations,
);

router.post(
  '/:userId/reservations/:bookId',
  validate(validateReservationParams),
  passport.authenticate('jwt', { session: false }),
  isUser,
  userController.createReservation,
);

router.delete(
  '/:userId/reservations/:bookId',
  validate(validateReservationParams),
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.deleteReservation,
);

export default router;
