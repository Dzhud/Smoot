const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const cors = require('cors');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');

app.use(cors());

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Function to detect silence
const detectSilence = (inputPath) => {
    return new Promise((resolve, reject) => {
        const silenceTimestamps = [];
        ffmpeg(inputPath)
            .audioFilters('silencedetect=n=-30dB:d=1')
            .on('stderr', (line) => {
                const silenceStartMatch = line.match(/silence_start: (\d+\.\d+)/);
                const silenceEndMatch = line.match(/silence_end: (\d+\.\d+)/);

                if (silenceStartMatch) {
                    silenceTimestamps.push({ start: parseFloat(silenceStartMatch[1]) });
                } else if (silenceEndMatch) {
                    const lastTimestamp = silenceTimestamps[silenceTimestamps.length - 1];
                    if (lastTimestamp && !lastTimestamp.end) {
                        lastTimestamp.end = parseFloat(silenceEndMatch[1]);
                    }
                }
            })
            .on('end', () => {
                resolve(silenceTimestamps);
            })
            .on('error', (err) => {
                console.error('Error detecting silence:', err.message);
                reject(err);
            })
            .save('tempfile.mkv');
    });
};

// Process Video Function
const processVideo = (inputPath, outputPath, silenceTimestamps) => {
    return new Promise((resolve, reject) => {
        if (!silenceTimestamps || silenceTimestamps.length === 0) {
            console.warn('No silence timestamps provided. Copying original video as processed output.');
            fs.copyFile(inputPath, outputPath, (err) => {
                if (err) {
                    console.error('Error copying original video:', err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
            return;
        }

        const filterComplexParts = [];
        silenceTimestamps.forEach((timestamp, index) => {
            const { start, end } = timestamp;

            if (end !== undefined) {
                filterComplexParts.push(
                    `[0:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[v${index}]`
                );
                filterComplexParts.push(
                    `[0:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${index}]`
                );
            }
        });

        const concatInputs = silenceTimestamps
            .map((_, index) => `[v${index}][a${index}]`)
            .join('');
        filterComplexParts.push(`${concatInputs}concat=n=${silenceTimestamps.length}:v=1:a=1[v][a]`);

        const filterComplex = filterComplexParts.join(';');

        ffmpeg(inputPath)
            .complexFilter(filterComplex)
            .outputOptions(['-map [v]', '-map [a]'])
            .on('start', (commandLine) => {
                console.log('Spawned FFmpeg with command:', commandLine);
            })
            .on('error', (err) => {
                console.error('FFmpeg Error:', err.message);
                reject(err);
            })
            .on('end', () => {
                console.log('Processing finished successfully');
                resolve();
            })
            .save(outputPath);
    });
};

// Video upload and processing route
app.post('/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const inputFile = req.file.path;
    const outputFile = path.join(uploadDir, `processed-${Date.now()}.mp4`);

    try {
        console.log('Detecting silence in the video...');
        const silenceTimestamps = await detectSilence(inputFile);
        console.log('Silence Timestamps:', silenceTimestamps);

        await processVideo(inputFile, outputFile, silenceTimestamps);

        const videoData = fs.readFileSync(outputFile, { encoding: 'base64' });

        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

        res.json({ success: true, videoData });
    } catch (err) {
        console.error('Error processing video:', err);
        res.status(500).json({ success: false, message: 'Error processing video', error: err.message });
    } finally {
        // Ensure tempfile is cleaned up
        if (fs.existsSync('tempfile.mkv')) {
            fs.unlinkSync('tempfile.mkv');
        }
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});