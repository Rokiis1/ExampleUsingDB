import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username cannot be empty'],
		unique: true,
		minlength: [6, 'Username must be at least 6 characters'],
		maxlength: [32, 'Username must be at most 32 characters']
	},
	password: {
		type: String,
		required: [true, 'Password cannot be empty'],
		minlength: [8, 'Password must be at least 8 characters'],
		maxlength: [128, 'Password must be at most 128 characters'],
		validate: {
			validator: function(v) {
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>?])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>?]{8,128}$/.test(v);
			},
			message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		}
	},
	email: {
		type: String,
		required: [true, 'Email cannot be empty'],
		unique: true,
		// validate: {
		// 	validator: function(v) {
		// 		return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
		// 	},
		// 	message: 'Email must be valid'
		// }
	},
	// reservations: {
	// 	type: [Number],
	// 	default: []
	// },
	reservations: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Book',
		default: []
	},
	
	registered_on: {
		type: Date,
		required: true,
		default: Date.now
	}
});

const User = mongoose.model('User', UserSchema);

export default User;