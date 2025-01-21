import React, { useState } from 'react';
import { 
    VideoCameraIcon,
    SparklesIcon
} from "@heroicons/react/outline";
import ReactPlayer from 'react-player';
import VideoDropZone from './videoDropZone.jsx';
import VideoEditor from './videoEditor.jsx';

const Process = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [processedVideo, setProcessedVideo] = useState(null);
    const [silenceButtonVisible, setSilenceButtonVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleFilesAdded = (files) => {
        const newVideos = files.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setVideos([...videos, ...newVideos]);
        setSilenceButtonVisible(true); // Show the silence button when files are added
    };

    const handleSilenceVideo = async () => {
        if (!selectedVideo) {
            console.error('No video selected');
            setErrorMessage('No video selected. Please select a video to process.');
            return;
        }

        const videoObject = videos.find(video => video.url === selectedVideo);
        if (!videoObject) {
            console.error('Selected video not found in video list');
            setErrorMessage('Selected video not found. Please try again.');
            return;
        }

        const formData = new FormData();
        formData.append('video', videoObject.file);

        setIsProcessing(true);
        setErrorMessage(null); // Clear any previous error

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process the video.');
            }

            const data = await response.json();
            const processedVideoUrl = `data:video/mp4;base64,${data.videoData}`; // Create a data URL
            setProcessedVideo(processedVideoUrl);
        } catch (error) {
            console.error('Error processing video:', error);
            setErrorMessage('An error occurred while processing the video. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <div className="bg-customBlue">Logo Should Be Here</div>
            <div className="relative flex flex-row items-start space-y-4 p-4">
                <div className="flex bg-zinc-50">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Sidebar Icons */}
                        {[
                            { icon: VideoCameraIcon, label: 'Video Silence Remover' },
                            { icon: SparklesIcon, label: 'Effects' }
                        ].map(({ icon: Icon, label }, index) => (
                            <div key={index} className="flex flex-col items-center space-y-1">
                                <Icon className="h-6 w-6 text-gray-500" />
                                <span className="text-gray-500">{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col m-2 pl-10 border-l-4 border-white-500">
                        <h1 className="text-2xl font-bold mb-4">Video Upload</h1>
                        <VideoDropZone onFilesAdded={handleFilesAdded} />

                        {videos.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold">Uploaded Videos</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {videos.map((video, index) => (
                                        <button 
                                            key={index} 
                                            className="relative rounded-lg overflow-hidden hover:cursor-pointer"
                                            onClick={() => setSelectedVideo(video.url)} 
                                        > Edit {setVideos[0]}
                                            <ReactPlayer url={video.url} controls width="100%" height="auto" className="rounded-lg" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedVideo && (
                            <div className="mt-4">
                                <hr className="border-2 border-gray-300 shadow-lg" />
                                <VideoEditor url={selectedVideo} />
                                {silenceButtonVisible && (
                                    <button 
                                        className="mt-2 p-2 bg-red-500 text-white rounded"
                                        onClick={handleSilenceVideo}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : 'Silence Video'}
                                    </button>
                                )}
                            </div>
                        )}

                        {processedVideo && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold">Processed Video</h2>
                                <video controls src={processedVideo} className="mt-4 w-full" />
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mt-4 text-red-500">
                                <p>{errorMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Process;
