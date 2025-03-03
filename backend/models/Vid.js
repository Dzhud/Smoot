import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    metaData: {
        name: { type: String, required: true },
        videoDuration: { type: Number }, // Store the total duration (in seconds) of the original video.
        fileSize: { type: Number }, // Store the size of the uploaded video in bytes.
        thumbnailPath: { type: String }, // Store the file path or URL of a thumbnail generated from the video.
        creationDate: { type: Date, default: Date.now }, // Stored as a string (toLocaleDateString() format)
    },
    processData: {
        status: { type: String, enum: ['queued', 'completed', 'failed'], required: true, default: 'queued' },
        originalFilePath: { type: String, required: true }, // to store the location or URL of the original uploaded file on the server.
        editedFilePath: { type: String }, // Store the actual file path or URL of the processed video instead of just using 'Download'.
        durationRemoved: { type: String, required: false }, // Silent duration removed, stored as a string (e.g., 57.54 seconds).
        cutsMade: { type: Number, default: 0, required: true }, // Number of cuts made, stored as an integer.
        silenceDetails: [{ start: Number, end: Number }], // store details of detected silence timestamps.
        processingTime: { type: Number }, // store the time it took (in seconds or milliseconds) to process the video.
        errorMessage: { type: String }, // Capture any errors encountered during processing
    },
    clientData: {
        downloadCount: { type: Number, default: 0 }, // Track how many times a processed file has been downloaded.
        tags: [String], // Allow users to tag their videos (e.g., "tutorial", "interview").
        isPublic: { type: Boolean, default: false }, // Indicates if a video is shared publicly.
        notes: { type: String }, // Allow users to add notes or descriptions to the video.
    },
    deviceInfo: { // Store metadata about the device used to upload the video (e.g., browser, OS).
        browser: { type: String },
        os: { type: String },
    },
    silenceParams: { // Group noise level and silence duration used for silence detection
        noiseLevel: { type: String, required: true },
        silenceDuration: { type: String, required: true },
    },
    requestId: { type: String, required: false, unique: true }, // Unique identifier for the process, generated using Math.random().
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to User model
}, { timestamps: true });

const Video = mongoose.model('Video', VideoSchema);

export default Video;