const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from the name
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate emails
        lowercase: true, // Normalize email for case-insensitive comparison
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Validation for email format
    },
    password: {
        type: String,
        required: true,
        //minlength: 8, // Enforce minimum password length
        select: false, // Do not return the password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Allow different roles for users
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false, // For email verification, if needed
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video', // Reference to the Video model
        },
    ],
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
