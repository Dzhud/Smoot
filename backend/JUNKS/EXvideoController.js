const Video = require('../models/Vid');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Upload and process a new video
const uploadVideo = async (req, res) => {
    const { name, durationRemoved, cutsMade } = req.body;

    try {
        // Validate input file path
        const inputFilePath = path.isAbsolute(name)
            ? name
            : path.join(__dirname, '..', 'uploads', name);

        if (!fs.existsSync(inputFilePath)) {
            return res.status(400).json({ message: 'Input file does not exist.' });
        }

        const outputFilePath = path.join(__dirname, '..', 'processed', `processed-${path.basename(name)}`);

        // Generate a unique request ID
        const requestId = Math.random().toString(36).substring(2, 10);

        // Save the video record in the database immediately
        const video = await Video.create({
            name: path.basename(name), // File name only
            originalFilePath: inputFilePath, // Full input path
            durationRemoved,
            cutsMade,
            requestId,
            editedFile: outputFilePath, // Placeholder path
        });

        // Respond to the client immediately
        res.status(202).json({
            message: 'Video is being processed.',
            videoId: video._id,
            requestId: video.requestId,
        });

        // Process the video asynchronously
        const ffmpegCommand = `ffmpeg -i "${inputFilePath}" -af silenceremove=stop_periods=-1:stop_threshold=-50dB "${outputFilePath}"`;

        exec(ffmpegCommand, async (error, stdout, stderr) => {
            if (error) {
                console.error(`FFmpeg error: ${error.message}`);

                // Update the video record with an error status
                await Video.findByIdAndUpdate(video._id, {
                    status: 'failed',
                    error: error.message,
                });
                return;
            }

            // Update the video record with the final processed file path and success status
            await Video.findByIdAndUpdate(video._id, {
                status: 'completed',
                editedFile: outputFilePath,
            });

            console.log(`Video processed successfully: ${outputFilePath}`);
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};



// Get a video by its request ID
const getVideoByRequestId = async (req, res) => {
    const { requestId } = req.params;

    try {
        // Find the video in the database by requestId
        const video = await Video.findOne({ requestId });

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json(video);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadVideo, getVideoByRequestId
};
