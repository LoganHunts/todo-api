const mongoose   = require( 'mongoose' );
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
    },
    email: {
        type: String,
        required: true,
    },
    role_id: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String
    },
});

module.exports = mongoose.model( 'User', userSchema );