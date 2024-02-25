// Importing express module
import express from 'express';
import userController from '../controller/userController.mjs';
import { userValidationSchema, updateUserFieldsValidationSchema, validateReservationParams, validateUserId } from '../validators/userValidator.mjs';
import { validate } from '../middleware/schemaValidator.mjs';

const router = express.Router();

router.get('/', userController.getUsers);

router.post('/', validate(userValidationSchema) , userController.createUser);

router.get('/:id', validate(validateUserId) , userController.getUserById);

router.put('/:id', validate(validateUserId, userValidationSchema), userController.updateUser);

router.patch('/:id', validate(validateUserId, updateUserFieldsValidationSchema) , userController.updateUserFields);

router.delete('/:id', validate(validateUserId) , userController.deleteUser);

router.get('/:id/reservations', validate(validateUserId) , userController.getUserReservations);

router.post('/:userId/reservations/:bookId', validate(validateReservationParams) , userController.createReservation);

router.delete('/:userId/reservations/:bookId', validate(validateReservationParams) , userController.deleteReservation);

// Export the router
export default router;