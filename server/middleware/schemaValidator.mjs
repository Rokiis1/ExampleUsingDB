import { validationResult } from 'express-validator';

export const validate = (schema) => {
	return async (req, res, next) => {
		// Run all validations
		//  Promises is an array of promises that will be resolved when all the validations are done running
		// Why we use Promise.all() here?
		// Because we want to run all the validations and collect all the errors
		// If we don't use Promise.all(), the first validation that fails will stop the execution of the rest of the validations
		await Promise.all(schema.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		next();
	};
};