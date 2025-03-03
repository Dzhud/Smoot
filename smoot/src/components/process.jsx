import React, { useState } from "react";
import ReactPlayer from "react-player";
import VideoDropZone from "./videoDropZone.jsx";
//import VideoEditor from "./videoEditor.jsx";
import VideoList from "./videoList.jsx";
import Sidebar from "./sidebar.jsx";
import VideoProgress from "./progress.jsx";


const Process = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestId, setRequestId] = useState(null);

  // Inputs for silence detection
  const [noiseLevel, setNoiseLevel] = useState("-30");
  const [silenceDuration, setSilenceDuration] = useState("2");

  // Metadata fields for the video
  const [videoMetadata, setVideoMetadata] = useState({
    requestId: null,
    originalFileName: null,
    noiseLevel: null,
    silenceDuration: null,
    status: null,
  });

  const handleFilesAdded = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const newVideo = {
        file,
        url: URL.createObjectURL(file),
      };
      setVideos([newVideo]);
      setSelectedVideo(newVideo.url);
    }
  };

  const handleSilenceVideo = async () => {
    if (!selectedVideo) {
      setErrorMessage("No video selected. Please select a video to process.");
      return;
    }

    const videoObject = videos.find((video) => video.url === selectedVideo);
    if (!videoObject) {
      setErrorMessage("Selected video not found. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", videoObject.file);
    formData.append('noiseLevel', noiseLevel);
    formData.append('silenceDuration', silenceDuration);

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      {/*console.log("Sending request to /api/videos/upload");*/}
      const response = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error("Failed to process the video.");
      }

      const data = await response.json();
      console.log("Response data:", data);

      setRequestId(data.requestId);


      // Update metadata
      setVideoMetadata({
        requestId: data.requestId,
        originalFileName: data.originalFileName,
        noiseLevel: data.noiseLevel,
        silenceDuration: data.silenceDuration,
        status: data.status,
      });
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("An error occurred while processing the video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
    for (let pair of formData.entries()) {
        console.log(`\tForm Entries: ${pair[0]}, ${pair[1]}`);
      }
  };

  return (
    <div>
      <div id="header">
        <div className="bg-customBlue">Logo Should Be Here</div>
      </div>
      <div className="flex-1 p-4 min-h-screen">
      {<Sidebar />}
      {/* main body*/}
      <div className="flex-1 ml-64 p-4 h-full">
      <div className="relative flex flex-row items-start space-y-4 p-4">
        <div className="flex bg-zinc-50">
          <div className="flex flex-col m-2 pl-10 border-l-4 border-white-500">
            <h1 className="text-2xl font-bold mb-4">Video Upload</h1>
            <VideoDropZone onFilesAdded={handleFilesAdded} />

            {videos.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Uploaded Video</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {videos.map((video, index) => (
                    <div key={index} className="flex flex-col space-y-4">
                      <button
                        className="relative rounded-lg overflow-hidden hover:cursor-pointer flex-col space-y-2"
                        onClick={() => setSelectedVideo(video.url)}>
                        <div className=" p-2 rounded-2xl">
                          <ReactPlayer
                            url={video.url}
                            controls
                            //width="320px"
                            width='full'
                            height="180px"
                            className="rounded-2xl"
                          />
                        </div>
                        <p className="text-customBlue font-extrabold">
                          {video.file.name}
                        </p>
                      </button>

                      {selectedVideo === video.url && (
                        <div className="flex flex-row mt-4 space-x-4">
                          <div className="mt-4">
                            <label htmlFor="noiseLevel" className="block text-sm font-medium text-gray-700">
                              Noise Level (dB)
                            </label>
                            <select
                              id="noiseLevel"
                              value={noiseLevel}
                              onChange={(e) => setNoiseLevel(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 mt-1"
                            >
                              {Array.from({ length: 81 }, (_, i) => -90 + i).map((level) => (
                                <option key={level} value={level}>
                                  {level} dB
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4">
                            <label htmlFor="silenceDuration" className="block text-sm font-medium text-gray-700">
                              Silence Duration (seconds)
                            </label>
                            <select
                              id="silenceDuration"
                              value={silenceDuration}
                              onChange={(e) => setSilenceDuration(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 mt-1"
                            >
                              {Array.from({ length: 5 }, (_, i) => i + 1).map((duration) => (
                                <option key={duration} value={duration}>
                                  {duration} seconds
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            className="mt-2 p-2 bg-green-500 text-white rounded"
                            onClick={handleSilenceVideo}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : "Remove Silence"}
                          </button>
                        </div>
                        
                      )}
                      
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoMetadata.requestId && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Processing Status</h2>
                <p><strong>Request ID:</strong> {videoMetadata.requestId}</p>
                <p><strong>Original File Name:</strong> {videoMetadata.originalFileName}</p>
                <p><strong>Noise Level:</strong> {videoMetadata.noiseLevel}</p>
                <p><strong>Silence Duration:</strong> {videoMetadata.silenceDuration}</p>
                <p><strong>Status:</strong> {videoMetadata.status}</p>
              </div>
            )}

            {requestId && <VideoProgress requestId={requestId} />}
            
            {errorMessage && (<div className="mt-4 text-red-500"><p>{errorMessage}</p></div>)}
            {<VideoList />}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;

