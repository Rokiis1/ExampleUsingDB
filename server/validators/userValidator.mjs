import { checkSchema, param } from 'express-validator';
import userModel from '../models/userModel.mjs';

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
		custom: {
			options: async (value) => {
				const existingUser = await userModel.getUserByEmail({ email: value });
				if (existingUser) {
					throw new Error('Email already exists.');
				}
			},
		},
	},
});

export const loginValidationSchema = [
	checkSchema({
		login: {
			notEmpty: {
				errorMessage: 'Login cannot be empty',
			},
			custom: {
				options: (value) => {
					return value.includes('@') ? checkSchema({ email: { isEmail: true } }) : typeof value === 'string';
				},
				errorMessage: 'Login must be a valid email or a username',
			},
		},
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
	param('id')
		.isInt()
		.withMessage('ID must be an integer')
];

export const validateReservationParams = [
	param('userId')
		.isInt()
		.withMessage('User ID must be an integer'),
	param('bookId')
		.isInt()
		.withMessage('Book ID must be an integer')
];