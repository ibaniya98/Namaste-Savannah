let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: String,
    isAdmin: {type: Boolean, default: false},
    resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);