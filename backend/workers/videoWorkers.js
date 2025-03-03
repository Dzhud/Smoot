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

// Function to convert bytes to megabytes
const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const videoWorkers = new Worker(
    "videoQueue",
    async (job) => {
        const io = getIo();
        const { inputFilePath, name, noiseLevel, silenceDuration, requestId, fileSize } = job.data;

        try {
            io.emit("processing_started", { requestId, progress: 10, message: "Processing Started" });
            const outputFilePath = `uploads/processed-${path.basename(inputFilePath)}.mp4`;
            console.log(`\t✂️ Processing video: ${inputFilePath} -> ${outputFilePath}`);
            
            // Step 1: Detect Silence
            console.log(`\t🚀 Detecting silence in: ${inputFilePath}`);
            const silenceTimestamps = await detectSilence(inputFilePath, noiseLevel, silenceDuration);
            io.emit("processing_progress", { requestId, progress: 50, message: "Silence detection completed" });
            console.log(`\t🔹 Silence detected:`, silenceTimestamps);
            
            // Step 2: Process Video
            const startTime = Date.now();
            await processVideo(inputFilePath, outputFilePath, silenceTimestamps);
            const processingTime = (Date.now() - startTime) / 1000; 
            console.log(`\t🔹 Processing Time(ms):`, processingTime);
            console.log("\t🛠 Job Data:", job.data);

            const fileSizeMB = bytesToMB(fileSize);
            console.log(`\t🔹 File Size: ${fileSizeMB} MB`);

            // Step 3: Save video details to MongoDB
            const video = await Video.create({
                requestId,
                silenceParams: { noiseLevel, silenceDuration },
                metaData: {
                    name,
                    videoDuration: 0, // Placeholder, update after processing
                    fileSize: fileSizeMB,
                    thumbnailPath: '', // Placeholder, update after processing
                },
                processData: {
                    status: 'completed',
                    originalFilePath: inputFilePath,
                    editedFilePath: outputFilePath,
                    durationRemoved: silenceTimestamps.reduce((acc, cur) => acc + (cur.end - cur.start), 0),
                    cutsMade: silenceTimestamps.length,
                    silenceDetails: silenceTimestamps,
                    processingTime,
                    errorMessage: '',
                }
        });

            io.emit("processing_complete", { requestId, progress: 100, message: "Video processing complete!", video });
            console.log(`\n✅ Video saved to DB: ${video.requestId}`);

        } catch (error) {
            io.emit("processing_failed", { requestId, progress: 0, error: error.message });
            console.error(`\t❌ Error processing video: ${error.message}`);
            throw error;
        }
    },
    { connection }
);

console.log("\t🎥 Redis Video Worker is running...");

export default videoWorkers;