// Create your Mongoose model
// mongoose.model is a method that allows us to create a model for our data
// a model is a class that is built from a schema and allows us to create documents

// Import mongoose
import mongoose from 'mongoose';

// Define your Mongoose schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
});

// arguments for mongoose.model are (modelName, schema)
const Book = mongoose.model('Book', bookSchema);

// Export the model
export default Book;