const Video = require('../models/Vid');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const express = require('express');
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
            .outputOptions(['-map [v]', '-map [a]'])
            .on('start', (commandLine) => console.log('FFmpeg command:', commandLine))
            .on('error', (err) => reject(err))
            .on('end', () => resolve())
            .save(outputPath);
    });
};


const uploadVideo = async (req, res) => {
    const { noiseLevel, silenceDuration } = req.body;
    const inputFilePath = req.file.path;
    const inputFilePathh = req.file.originalname;

    if (res.statusCode === 404) {
        return res.status(404).json({ message: 'Ouch! 400 Error!' });
    }

    if (!inputFilePath) {
        return res.status(400).json({ message: 'No video file uploaded.' });
    }
    const requestId = Math.random().toString(36).substring(2, 10);
    try {
        const outputFilePath = path.join(
            path.dirname(inputFilePath),
            `processed-${path.basename(inputFilePath)}.mp4`
        );

        const silenceTimestamps = await detectSilence(inputFilePath, noiseLevel, silenceDuration);
        const startTime = Date.now();
        await processVideo(inputFilePath, outputFilePath, silenceTimestamps);
        const processingTime = (Date.now() - startTime) / 60; // Time in minutes

        const video = await Video.create({
            /*name: path.basename(inputFilePath),*/
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

        res.status(201).json({video, videoMetadata: video});
    } catch (error) {
        console.error('Error processing video1:', error);
        res.status(500).json({ message: 'Error processing video', error: error.message });
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
//Tidy DB record and responses e.g metdata etc
// looks like the trimming is doing the opposite of what it should be doing
//Python script dat automates delete
//1 silence segments detected at noise tolerance level -60dB and minimum noise duration of 2 seconds in sample.mp4