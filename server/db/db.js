const Mongoose = require('mongoose');

//load database
Mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true });
const database = Mongoose.connection;

database.on('error', (e) => {
    console.log('Error connecting to MongoDB', e);
});
database.once('open', () => {
    console.log('MongoDB connection successful');
});

export const db = database