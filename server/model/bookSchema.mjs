import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Author', // Assuming you have an Author model
		required: true
	},
	published_on: {
		type: Date,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	available: {
		type: Boolean,
		default: true
	}
});

const Book = mongoose.model('Book', bookSchema);

export default Book;