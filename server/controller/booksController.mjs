import Book from '../model/bookSchema.mjs';

const booksController = {

	getBooks: async (req, res) => {
		try {
			if (req.query.paginate === 'true') {
				const page = parseInt(req.query.page) || 1; // Default to page 1
				const limit = parseInt(req.query.limit) || 3; // Default to 3 items per page

				const books = await Book.find()
					.skip((page - 1) * limit)
					.limit(limit);

				res.status(200).json(books);
			} else {
				const books = await Book.find(); // Use Mongoose's find method to fetch all books
				res.status(200).json(books);
			}
		} catch (error) {
			res.status(500).json({ message: 'An error occurred while fetching books.' });
		}
	},

	createBook: async (req, res) => {
		try {
			const book = await Book.create(req.body);
			res.status(201).json(book);
		} catch (err) {
			res.status(500).json({ message: 'An error occurred while creating the book.' });
		}
	}
    
};

export default booksController;