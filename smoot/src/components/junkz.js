/*
<button onClick={handlePlayPause} className="btn bg-customBlue text-white px-4 py-2 rounded mr-2">
{playing ? 'Pause' : 'Play'}
</button>
<PlayIcon className="h-6 w-6 text-customBlue" /> 
                    <span className="text-customBlue">
                    {playing ? 'Pause' : 'Play'}
                    </span>
*/
{/*}
import React from 'react';
import { 
    CameraIcon, FilterIcon, AdjustmentsIcon, PhotographIcon, ChatIcon, VolumeUpIcon, VideoCameraIcon,
    SparklesIcon
} from "@heroicons/react/outline";
//import ReactPlayer from 'react-player/lazy';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import VideoDropZone from './videoDropZone.jsx';
import VideoEditor from './videoEditor.jsx';
//import Silencer from './silencer.jsx';


const Process = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleFilesAdded = (files) => {
        const newVideos = files.map((file) => URL.createObjectURL(file));
        setVideos([...videos, ...newVideos]);
      };

    
    
  return (
    <div>
      <div className="bg-customBlue">Logo Should Be Here</div>
        <div className="relative flex flex-row items-start space-y-4 p-4">
            <div className='flex bg-zinc-50'>
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-col items-center space-y-1"> 
                        <CameraIcon className="h-6 w-6 text-gray-500" /> 
                            <span className="text-gray-500">Camera</span>
                    </div> 
                    <div className="flex flex-col items-center space-y-1">
                        <FilterIcon className="h-6 w-6 text-gray-500" /> 
                            <span className="text-gray-500">Media</span> 
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <AdjustmentsIcon className="h-6 w-6 text-gray-500" />
                            <span className="text-gray-500">Animations</span> 
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <PhotographIcon className="h-6 w-6 text-gray-500" />
                            <span className="text-gray-500">Video</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <ChatIcon className="h-6 w-6 text-gray-500" />
                            <span className="text-gray-500">Caption</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <VolumeUpIcon className="h-6 w-6 text-gray-500" />
                            <span className="text-gray-500">Audio</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <VideoCameraIcon className="h-6 w-6 text-gray-500" />
                            <span className="text-gray-500">Filters</span> 
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <SparklesIcon className="h-6 w-6 text-gray-500" /> 
                            <span className="text-gray-500">Effects</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <SparklesIcon className="h-6 w-6 text-gray-500" /> 
                            <span className="text-gray-500">Effects</span>
                    </div>
            
                </div>

            <div className=" flex flex-col m-2 pl-10 border-l-4 border-white -500 ">
                <h1 className="text-2xl font-bold mb-4">Video Upload</h1>
                <VideoDropZone onFilesAdded={handleFilesAdded} />
                
                {videos.length > 0 && (
                    <div className="mt-4">
                    <h2 className="text-xl font-semibold">Uploaded Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {videos.map((video, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden hover:cursor-pointer"onClick={() => setSelectedVideo(video)} >                        
                            <ReactPlayer url={video} controls width="100%" height="auto" className="rounded-lg " />  
                            
                        </div>
                        
                        ))}
                    </div>
                    </div>
                
                )}
            {selectedVideo && (
                        <div className="mt-4">
                            <hr className="border-2 border-gray-300 shadow-lg" />
                            {/*<h2 className="text-xl font-semibold-4">Edit Video</h2>*/}
                            <VideoEditor url={selectedVideo} />
                            {/*<button className="mt-2 p-2 bg-red-500 text-white rounded" onClick={() => setSelectedVideo(null)}>
                            Close Editor
                            </button> */}
                        </div>
                        )}

         </div>

                        
        
        
        
        
        </div>

        </div>

    </div>
  )
};

export default Process;
*/}
{/*Other Functionalities to Add*/}
{/* cutting/splitting videos, adding annotations, and exporting the edited video.*/}

{/*}
import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const AudioNoiseRemover = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [outputAudio, setOutputAudio] = useState(null);
  const [message, setMessage] = useState('');

  const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
  };

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const removeNoise = async () => {
    if (!audioFile) {
      setMessage('Please upload an audio file first.');
      return;
    }

    setMessage('Processing... Please wait.');

    await loadFFmpeg();

    const fileName = 'input.wav';
    const outputFileName = 'output.wav';


    ffmpeg.FS('writeFile', fileName, await fetchFile(audioFile));

    await ffmpeg.run(
      '-i', fileName,
      '-af', 'silenceremove=stop_periods=-1:stop_threshold=-20dB:stop_duration=0.72:window=0',
      outputFileName
    );


    const data = ffmpeg.FS('readFile', outputFileName);


    const audioURL = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/wav' }));
    setOutputAudio(audioURL);
    setMessage('Noise removal complete.');
  };

  return (
    <div>
      <h1>Audio Noise Remover</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={removeNoise}>Remove Noise</button>
      {message && <p>{message}</p>}
      {outputAudio && (
        <div>
          <h2>Output Audio</h2>
          <audio controls src={outputAudio}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioNoiseRemover;

*/}

const processVideo = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                //'-vf', 'scale=640:360', // Correct usage of video filter
                '-vf', 'scale=600:300', // Correct usage of video filter
            ])
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