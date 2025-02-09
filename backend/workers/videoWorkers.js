const { Worker } = require("bullmq");
const Redis = require("ioredis");
const path = require("path");
const Video = require("../models/Vid");
const { detectSilence, processVideo } = require("../controllers/videoController");

const connection = new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null, // Prevents Redis conflicts
});

connection.on("error", (err) => console.error("\t❌ Redis Error:", err));

const videoWorkers = new Worker(
    "videoQueue",
    async (job) => {
        const { inputFilePath, inputFilePathh, noiseLevel, silenceDuration, requestId } = job.data;

        try {
            console.log(`\t🚀 Detecting silence in: ${inputFilePath}`);
            const silenceTimestamps = await detectSilence(inputFilePath, noiseLevel, silenceDuration);

            console.log(`\t🔹 Silence detected:`, silenceTimestamps);

            const outputFilePath = `uploads/processed-${path.basename(inputFilePath)}.mp4`;
            console.log(`\t✂️ Processing video: ${inputFilePath} -> ${outputFilePath}`);

            const startTime = Date.now();
            await processVideo(inputFilePath, outputFilePath, silenceTimestamps);
            const processingTime = (Date.now() - startTime) / 1000; // Time in seconds

            // Save video details to MongoDB
            const video = await Video.create({
                name: inputFilePathh,
                originalFilePath: inputFilePath,
                editedFilePath: outputFilePath,
                requestId,
                silenceDetails: silenceTimestamps,
                durationRemoved: silenceTimestamps.reduce((acc, cur) => acc + (cur.end - cur.start), 0),
                cutsMade: silenceTimestamps.length,
                processingTime,
                noiseLevel,
                silenceDuration,
            });

            //console.log(`✅ Video saved to DB: ${video._id}`);
            console.log(`✅ Video saved to DB: ${video.requestId}`);
        } catch (error) {
            console.error(`❌ Error processing video: ${error.message}`);
            throw error;
        }
    },
    { connection }
);

console.log("🎥 Redis Video Worker is running...");

module.exports = videoWorkers;