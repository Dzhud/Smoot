import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import videoRoutes from './routes/vidRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import { getIo, initSocket } from './config/socket.js';
import videoQueue from './queues/videoQueue.js';

import './workers/videoWorkers.js'; // Start video processing workers

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'uploads')));


// Middleware
app.use(express.json());
const server = http.createServer(app);
/*
app.get('*', (req, res) => {
    console.log(`Route not found: ${req.originalUrl}`);
    res.status(404).send('Route not found');
});*/

// Connect to MongoDB
connectDB();

// Initialize WebSockets
initSocket(server);
const io = getIo(server); // Get the io instance after initialization

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

//Redis job test
videoQueue.getJobs(["waiting", "active", "delayed"])
  .then(jobs => console.log("\t**** Current Jobs in Queue:", jobs))
  .catch(err => console.error("\t Error fetching jobs:", err));


// Start Express server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`\t Express Server running on http://localhost:${PORT}`));
//app.listen(PORT, () => console.log(`\t Express Server running on http://localhost:${PORT}`));




