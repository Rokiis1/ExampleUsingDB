import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect('mongodb+srv://admin:DJxb2WCBuHtQ1sNU@cluster0.qhdcopl.mongodb.net/', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
				
		console.log('MongoDB connected...');
		return mongoose.connection.client;
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

export default connectDB;