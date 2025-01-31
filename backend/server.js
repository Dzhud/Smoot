const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const videoRoutes = require('./routes/vidRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db')
const cors = require('cors');
const path = require('path');

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
app.use(express.json());
/*
app.get('*', (req, res) => {
    console.log(`Route not found: ${req.originalUrl}`);
    res.status(404).send('Route not found');
});*/

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('\t Connected to Express Server'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));


// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
connectDB();


