const mongoose = require('mongoose');
// Helps in adding username and password in db
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim:  true, // Trim basically removed any space given in front and last. So that it don't get stored in DB
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true, // So that two account cant be created using one email 
        required: true,
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.jpeg'
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});

// This connected localMongoose with this schema - automatically
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;