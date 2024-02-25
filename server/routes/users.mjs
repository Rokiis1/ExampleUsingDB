// Importing express module
import express from 'express';
import userController from '../controller/userController.mjs';

const router = express.Router();

router.get('/', userController.getUsers);

router.post('/register', userController.createUser);

router.post('/login', userController.login);

router.get('/:id', userController.getUserById);

router.put('/:id', userController.updateUser);

router.patch('/:id', userController.updateUserFields);

router.delete('/:id', userController.deleteUser);

router.get('/:id/reservations', userController.getUserReservations);

router.post('/:userId/reservations/:bookId', userController.createReservation);

router.delete('/:userId/reservations/:bookId', userController.deleteReservation);

// Export the router
export default router;