import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // For password hashing

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from the name
    },
    lastName: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from the name
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate usernames
        trim: true, // Remove whitespace from the username
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
        select: false, // Do not return the password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Allow different roles for users
        default: 'user',
    },
    profilePicture: {
        type: String,
        default: '', // URL to the user's profile picture
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
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
    next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;