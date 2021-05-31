const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({     //we are not going to specify username and password which will automatically add on by the package
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);   //add on to our schema, plugin the package into your User schema
//will add a username, hash and salt field to store the username, the hashed password and the salt value.

module.exports = mongoose.model('User', UserSchema);