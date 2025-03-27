import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //console.log('Plaintext Password:', password);
        //console.log('Generated Hashed Password:', hashedPassword);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });

        // Save user to the database
        await user.save();

        console.log('Saved User:', user);

        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
    
        if (!user) {
            console.error('User not found');
            throw new Error('Invalid email or password');
        }

        //console.log('Stored hashed password:', user.password);
        //console.log('Provided password:', password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch); // Log the result of the password comparison

        if (!isMatch) {
            console.error('Password does not match');
            throw new Error('Invalid email or password');
        }

        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        console.log('Generated JWT token:', token);

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        //console.log('User data:', user); // Debugging log
        res.json(user || {});  // Send back the user data
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export { registerUser, loginUser , getUserProfile};