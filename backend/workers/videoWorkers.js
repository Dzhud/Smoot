import { Worker } from 'bullmq';
import Redis from 'ioredis';
import path from 'path';
import dotenv from 'dotenv';
import { getIo } from '../config/socket.js';
import Video from '../models/Vid.js';
import { detectSilence, processVideo } from '../controllers/videoController.js';

dotenv.config();

// Initialize Redis connection
const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
});

connection.on("error", (err) => console.error("\t❌ Redis Error:", err));

const videoWorkers = new Worker(
    "videoQueue",
    async (job) => {
        const io = getIo(); // ✅ Call getIo() inside the worker function
        const { inputFilePath, name, noiseLevel, silenceDuration, requestId } = job.data;

        try {
            io.emit("processing_started", { requestId, progress: 10, message: "Processing Started" });
            const outputFilePath = `uploads/processed-${path.basename(inputFilePath)}.mp4`;
            console.log(`\t✂️ Processing video: ${inputFilePath} -> ${outputFilePath}`);
            
            // Step 1: Detect Silence
            console.log(`\t🚀 Detecting silence in: ${inputFilePath}`);
            const silenceTimestamps = await detectSilence(inputFilePath, noiseLevel, silenceDuration);
            io.emit("processing_progress", { requestId, progress: 80, message: "Silence detection completed" });
            console.log(`\t🔹 Silence detected:`, silenceTimestamps);
            
            // Step 2: Process Video
            const startTime = Date.now();
            await processVideo(inputFilePath, outputFilePath, silenceTimestamps);
            const processingTime = (Date.now() - startTime) / 1000; 
            console.log(`\t🔹 Processing Time(ms):`, processingTime);
            console.log("\t🛠 Job Data:", job.data);


            // Step 3: Save video details to MongoDB
            const video = await Video.create({
                name: name,
                originalFilePath: inputFilePath,
                editedFilePath: outputFilePath,
                requestId,
                silenceDetails: silenceTimestamps,
                durationRemoved: silenceTimestamps.reduce((acc, cur) => acc + (cur.end - cur.start), 0),
                cutsMade: silenceTimestamps.length,
                processingTime,
                noiseLevel,
                silenceDuration,
                status: "completed",
            });

            io.emit("processing_complete", { requestId, progress: 100, message: "Video processing complete!", video });
            console.log(`✅ Video saved to DB: ${video.requestId}`);

        } catch (error) {
            io.emit("processing_failed", { requestId, progress: 0, error: error.message });
            console.error(`\t❌ Error processing video: ${error.message}`);
            throw error;
        }
    },
    { connection }
);

console.log("\t🎥 Redis Video Worker is running...");

// ✅ Export the worker for use in other files
export default videoWorkers;