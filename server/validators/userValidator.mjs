import { checkSchema, param, oneOf } from 'express-validator';
import mongoose from 'mongoose';

export const userValidationSchema = checkSchema({
	username: {
		isLength: {
			options: { min: 6, max: 32 },
			errorMessage: 'Username must be at least 6 characters with a max of 32 characters',
		},
		notEmpty: {
			errorMessage: 'Username cannot be empty',
		},
		isString: {
			errorMessage: 'Username must be a string!',
		},
	},
	password: {
		isLength: {
			options: { min: 8, max: 128 },
			errorMessage: 'Password must be between 8 and 128 characters',
		},
		matches: {
			options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>?])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>?]{8,128}$/,
			errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
		},
		notEmpty: {
			errorMessage: 'Password cannot be empty',
		},
	},
	email: {
		isEmail: {
			errorMessage: 'Email must be valid',
		},
		notEmpty: {
			errorMessage: 'Email cannot be empty',
		},
	},
});

export const loginValidationSchema =  [
	oneOf([
		checkSchema({
			username: {
				notEmpty: {
					errorMessage: 'Username cannot be empty',
				},
				isString: {
					errorMessage: 'Username must be a string!',
				},
			},
		}),
		checkSchema({
			email: {
				notEmpty: {
					errorMessage: 'Email cannot be empty',
				},
				isEmail: {
					errorMessage: 'Email must be valid',
				},
			},
		}),
	], 'Either username or email must be provided'),
	checkSchema({
		password: {
			notEmpty: {
				errorMessage: 'Password cannot be empty',
			},
		},
	}),
];

export const updateUserFieldsValidationSchema = checkSchema({
	username: {
		optional: true,
		isLength: {
			options: { min: 6, max: 32 },
			errorMessage: 'Username must be at least 6 characters with a max of 32 characters',
		},
		isString: {
			errorMessage: 'Username must be a string!',
		},
	},
	password: {
		optional: true,
		isLength: {
			options: { min: 8, max: 128 },
			errorMessage: 'Password must be between 8 and 128 characters',
		},
		matches: {
			options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>?])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>?]{8,128}$/,
			errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
		},
	},
	email: {
		optional: true,
		isEmail: {
			errorMessage: 'Email must be valid',
		},
	},
});

export const validateUserId = [
	param('_id')
		.custom((value) => mongoose.Types.ObjectId.isValid(value))
		.withMessage('ID must be a valid MongoDB ObjectId')
];

export const validateReservationParams = [
	param('userId')
		.isInt()
		.withMessage('User ID must be an integer'),
	param('bookId')
		.isInt()
		.withMessage('Book ID must be an integer')
];