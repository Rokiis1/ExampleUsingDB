import bookModel from '../model/bookModel.mjs';

const booksController = {

	getBooks: async (req, res) => {
		try {
			const books  = await bookModel.getBooks();
			res.status(200).json(books);
		} catch (error) {
			res.status(500).json({ message: 'An error occurred while fetching books.' });
		}
	},

	createBook: async (req, res) => {
		try {
			const book = await bookModel.createBook(req.body);
            
			res.status(201).json(book);
		} catch (err) {
			if (err.message === 'Author not found.') {
				res.status(404).json({ message: 'Author not found.' });
				return;
			} else {
				res.status(500).json({ message: 'An error occurred while creating the book.' });
			}
		}
	}
    
};

export default booksController;