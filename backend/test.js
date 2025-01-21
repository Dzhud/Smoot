const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
console.log('FFmpeg Path:', ffmpegPath);

const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to detect silent parts and remove them
function processVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    let silenceTimestamps = [];

    // First pass: Detect silent parts
    ffmpeg(inputPath)
      .audioFilters('silencedetect=n=-50dB:d=1')
      .on('stderr', (line) => {
        // Parsing the silencedetect output
        const silenceStart = line.match(/silence_start: (\d+\.\d+)/);
        const silenceEnd = line.match(/silence_end: (\d+\.\d+)/);

        if (silenceStart) {
          console.log(`Silence start: ${silenceStart[1]}`);
          silenceTimestamps.push({ type: 'start', time: parseFloat(silenceStart[1]) });
        }
        if (silenceEnd) {
          console.log(`Silence end: ${silenceEnd[1]}`);
          silenceTimestamps.push({ type: 'end', time: parseFloat(silenceEnd[1]) });
        }
      })
      .on('end', function () {
        console.log('First pass completed.');

        // Second pass: Remove silent parts using trim filters
        if (silenceTimestamps.length === 0) {
          console.log('No silent parts detected. Copying input to output.');
          ffmpeg(inputPath)
            .output(outputPath)
            .on('start', () => console.log('Encoding started'))
            .on('progress', (progress) => console.log('Processing: ' + progress.percent + '% done'))
            .on('error', (err) => {
              console.error('An error occurred:', err.message);
              reject(err);
            })
            .on('end', () => {
              console.log('Encoding finished.');
              resolve();
            })
            .run();
          return;
        }

        let filterComplex = '';
        let lastEnd = 0;
        let count = 0;

        silenceTimestamps.forEach((item, index) => {
          if (item.type === 'start' && (index === 0 || silenceTimestamps[index - 1].type === 'end')) {
            const start = lastEnd;
            const end = item.time;
            if (start !== end) {
              filterComplex += `;[0:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[v${count}];[0:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${count}]`;
              count++;
            }
          }
          if (item.type === 'end') {
            lastEnd = item.time;
          }
        });

        filterComplex = filterComplex.substring(1); // Remove the leading semicolon
        const concatFilter = filterComplex
          .split(';')
          .map((_, idx) => `[v${idx}][a${idx}]`)
          .join('');

        ffmpeg(inputPath)
          .complexFilter(`${filterComplex};${concatFilter}concat=n=${count}:v=1:a=1[v][a]`)
          .outputOptions(['-map [v]', '-map [a]'])
          .output(outputPath) // Ensure the output path is specified
          .on('start', () => console.log('Encoding started'))
          .on('progress', (progress) => console.log('Processing: ' + progress.percent + '% done'))
          .on('error', (err) => {
            console.error('An error occurred:', err.message);
            reject(err);
          })
          .on('end', () => {
            console.log('Encoding finished.');
            resolve();
          })
          .run();
      })
      .on('error', (err) => {
        console.error('An error occurred during the first pass:', err.message);
        reject(err);
      })
      .output('tempfile.mkv') // Use a temporary file to make sure FFmpeg runs
      .run();
  });
}

// Provide the input and output paths
const inputPath = '/Users/omotayo/Downloads/sample.mp4';
const outputPath = 'output.mp4';

// Process the video
processVideo(inputPath, outputPath)
  .then(() => console.log('Video processing completed.'))
  .catch((err) => console.error('Video processing failed:', err));