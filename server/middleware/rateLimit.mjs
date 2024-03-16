import rateLimit from 'express-rate-limit';

// Enable rate limiting for all routes
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 500, // limit each IP to 500 requests per windowMs
	message: 'Too many requests from this IP, please try again after 15 minutes'
});