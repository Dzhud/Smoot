import Video from '../models/Vid.js';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

import express from 'express';
import videoQueue from '../queues/videoQueue.js';
import { register } from 'module';


const router = express.Router();

//Works Fine after comparing with detecting silence in normal ffmpeg cli cmd.
const detectSilence = (filePath, noiseLevel, silenceDuration) => {
    return new Promise((resolve, reject) => {
        const silenceTimestamps = [];
        ffmpeg(filePath)
            .audioFilters(`silencedetect=n=${noiseLevel}dB:d=${silenceDuration}`)
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
            .on('end', () => resolve(silenceTimestamps))
            .on('error', (err) => reject(err))
            .output('dummyOutputFile.mp4')
            .run();
    });
};


// Process video file.
const processVideo = (inputPath, outputPath, silenceTimestamps, videoDuration) => {
    return new Promise((resolve, reject) => {
        if (silenceTimestamps.length === 0) {
            console.log('No silence detected, skipping trimming.');
            fs.copyFileSync(inputPath, outputPath);
            return resolve();
        }

        let lastEnd = 0;
        const nonSilentSegments = [];

        for (const { start, end } of silenceTimestamps) {
            if (lastEnd < start) {
                nonSilentSegments.push({ start: lastEnd, end: start });
            }
            lastEnd = end;
        }

        // If there's still some video left after the last silence segment, keep it
        if (lastEnd < videoDuration) {
            nonSilentSegments.push({ start: lastEnd, end: videoDuration });
        }

        if (nonSilentSegments.length === 0) {
            console.log('No non-silent segments detected.');
            return reject(new Error('No non-silent parts found.'));
        }

        const filterComplexParts = nonSilentSegments.map(({ start, end }, index) => {
            return [
                `[0:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[v${index}]`,
                `[0:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${index}]`,
            ];
        });

        const concatInputs = nonSilentSegments.map((_, index) => `[v${index}][a${index}]`).join('');
        const filterComplex = [
            ...filterComplexParts.flat(),
            `${concatInputs}concat=n=${nonSilentSegments.length}:v=1:a=1[v][a]`
        ].join(';');

        ffmpeg(inputPath)
            .complexFilter(filterComplex)
            .outputOptions(['-map [v]', '-map [a]',
                '-c:v libx264',   // Use efficient H.264 codec
                '-preset ultrafast',  // Faster processing
                '-crf 23'  // Balances quality and compression
            ])
            .on('start', (commandLine) => console.log('FFmpeg command:', commandLine))
            .on('error', (err) => reject(err))
            .on('end', () => resolve())
            .save(outputPath);
    });
};


const uploadVideo = async (req, res) => {
    const { noiseLevel, silenceDuration, name } = req.body;
    const inputFilePath = req.file.path;
    const originalFileName = req.file.originalname;
    const fileSize = req.file.size;

    if (!inputFilePath) {
        return res.status(400).json({ message: 'No video file uploaded.' });
    }

    const requestId = Math.random().toString(36).substring(2, 10);

    try {
        console.log("\tAdding job to queue:", {
            name,
            inputFilePath,
            originalFileName,
            noiseLevel,
            silenceDuration,
            requestId,
            fileSize
        });
        // Add job to the BullMQ queue
        await videoQueue.add("processVideo", {
            name: originalFileName,
            inputFilePath,
            originalFileName,
            noiseLevel,
            silenceDuration,
            requestId,
            fileSize
        });
        console.log("\tJob successfully added to queue (controller)");

        // Respond immediately, without waiting for processing to complete
        res.status(202).json({ message: "Video processing started", requestId,  status: 'queued',
            originalFileName, noiseLevel, silenceDuration,
         });
        
    } catch (error) {
        console.error('Error adding job to queue:', error);
        res.status(500).json({ message: 'Error queuing video processing', error: error.message });
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

export {
    uploadVideo, processVideo, detectSilence, getVideoByRequestId,

};
//Add UserID to VideoProcess
//GooglE login integration