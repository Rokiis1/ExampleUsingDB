import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
	_id: String,
	expires: Date,
	session: String,
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;