const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Books = new Schema({
    title: String,
    image: String,
    description: String
});

export default mongoose.model('Book', Books);