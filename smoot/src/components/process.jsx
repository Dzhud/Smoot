import React, { useState } from "react";
import {
  VideoCameraIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import ReactPlayer from "react-player";
import VideoDropZone from "./videoDropZone.jsx";
import VideoEditor from "./videoEditor.jsx";
import VideoList from "./videoList.jsx";

const Process = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Inputs for silence detection
  const [noiseLevel, setNoiseLevel] = useState("-40");
  const [silenceDuration, setSilenceDuration] = useState("2");

  // Metadata fields for the video
  const [videoMetadata, setVideoMetadata] = useState({
    videoDuration: null,
    processingTime: null,
    cutsMade: null,
    requestId: null,
    originalFilePath: null,
    editedFilePath: null,
    silenceDetails: [],
    fileSize: null,
    tags: [],
  });

  const handleFilesAdded = (files) => {
    const newVideos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setVideos([...videos, ...newVideos]);
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
      console.log("Sending request to /api/videos/upload");
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

      // Adjust based on the actual response structure
      setProcessedVideo(data.video.editedFilePath);

      // Update metadata
      setVideoMetadata({
         videoDuration: data.video.videoDuration,
         processingTime: data.video.processingTime,
         cutsMade: data.video.cutsMade,
         requestId: data.video.requestId,
         originalFilePath: data.video.originalFilePath,
         editedFilePath: data.video.editedFilePath,
         silenceDetails: data.video.silenceDetails,
         fileSize: data.video.fileSize,
         tags: data.video.tags,
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
      <div className="bg-customBlue">Logo Should Be Here</div>
      <div className="relative flex flex-row items-start space-y-4 p-4">
        <div className="flex bg-zinc-50">
          <div className="flex flex-col items-center space-y-4">
            {[
              { icon: VideoCameraIcon, label: "Video Silence Remover" },
              { icon: SparklesIcon, label: "Effects" },
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
                    >
                      <ReactPlayer
                        url={video.url}
                        controls
                        width="100%"
                        height="auto"
                        className="rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedVideo && (
              <div className="mt-4">
                <hr className="border-2 border-gray-300 shadow-lg" />
                <VideoEditor url={selectedVideo} />

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
                  className="mt-2 p-2 bg-red-500 text-white rounded"
                  onClick={handleSilenceVideo}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Silence Video"}
                </button>
              </div>
            )}

            {processedVideo && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Processed Video</h2>
                
                <img src={`http://localhost:5000/api/videos/${videoMetadata.editedFilePath}`} alt="Processed Video Thumbnail" />

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Video Metadata</h3>
                  <p><strong>Processing Time:</strong> {Math.round(videoMetadata.processingTime)} Milliseconds</p>
                  <p><strong>Cuts Made:</strong> {videoMetadata.cutsMade}</p>
                  <p><strong>Request ID:</strong> {videoMetadata.requestId}</p>
                  <p><strong>Original File Path:</strong> {videoMetadata.originalFilePath}</p>
                  <p><strong>Edited File Path:</strong> {videoMetadata.editedFilePath}</p>
                </div>
              </div>
            )}
            
            {<VideoList />}

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