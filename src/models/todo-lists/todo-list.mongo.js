const mongoose   = require( 'mongoose' );
const todoSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required : true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model( 'todo-lists', todoSchema );