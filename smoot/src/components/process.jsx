import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import VideoDropZone from "./videoDropZone.jsx";
import VideoList from "./videoList.jsx";
import Sidebar from "./sidebar.jsx";
import VideoProgress from "./progress.jsx";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:5000");

const Process = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reloadVideoList, setReloadVideoList] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Smoot - Process Video";
  }, []);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = sessionStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
        setUserId(data._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleProgressUpdate = (data) => {
      if (data.requestId === requestId) {
        if (data.progress === 100) {
          setProcessingComplete(true);
          setIsProcessing(false);
          setReloadVideoList(prev => !prev); // Toggle state to trigger reload

          // Display toast notification
          toast.success(
            <div>
              Silence Removal Completed 🎉
            </div>,
            { autoClose: 10000 } // Auto close after 10 seconds
          );
        }
      }
    };

    socket.on("processing_complete", handleProgressUpdate);

    return () => {
      socket.off("processing_complete", handleProgressUpdate);
    };
  }, [requestId, videoMetadata]);

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
    formData.append('user', userId);
    formData.append('videoDuration', Number(videoMetadata.videoDuration));

    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      setErrorMessage("Authentication token missing. Please log in.");
      navigate('/login');
      return;
      };
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${authToken}`, 
        }
      });

      if (!response.ok) {
        throw new Error("Failed to process the video.");
      }

      const data = await response.json();
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
      setIsProcessing(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('authToken'); // Clear user authentication token
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div className="flex items-center justify-between bg-white shadow-md">
          <div className="text-white text-2xl font-bold">
            <a href="/">
              <img src="/smt.png" alt="logo" className="h-12 w-auto" />
            </a>
          </div>

          {/* Dropdown for user */}
          {user ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-customBlue font-bold">
                  {user.username || user.email}
                </span>
                <svg
                  className={`w-4 h-4 text-customBlue transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-customBlue transition-colors duration-200"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-customBlue transition-colors duration-200"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      {/* Beta Banner */}
      <div style={{ position: 'fixed', top: '3rem', left: 0, right: 0, zIndex: 9 }}>
        <div className="bg-yellow-300 text-black text-center py-0 font-bold">
          🚧 Beta Version. 🚀
        </div>
      </div>
        
      <div className="flex-1 p-4 min-h-screen">
        <Sidebar /> <br />
        <div className="flex-1 ml-64 p-4 h-full">
          <div className="relative flex flex-row items-start space-y-4 p-4">
            <div className="flex bg-zinc-50" style={{ borderRadius: '1rem' }}>
              <div className="flex flex-col m-2 pl-10 border-l-4 border-white-500">
                <h1 className="text-2xl font-bold mb-4 text-customBlue">Video Upload</h1>
                <VideoDropZone onFilesAdded={handleFilesAdded} />

                {videos.length > 0 && (
                  <div className="mt-4" >
                    <h2 className="text-xl font-semibold">Uploaded Video</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" id='player'>
                      {videos.map((video, index) => (
                        <div key={index} className="flex flex-col space-y-4">
                          <button
                            className="relative rounded-lg overflow-hidden hover:cursor-pointer flex-col space-y-2"
                            onClick={() => setSelectedVideo(video.url)}>
                            <div className="p-2 rounded-2xl overflow-hidden">
                              <ReactPlayer
                                url={video.url}
                                controls
                                width='full'
                                height="180px"
                                className="react-player"
                                style={{ borderRadius: '1rem', overflow: 'hidden', objectFit: 'cover' }}
                                onDuration={(duration) => {
                                  setVideoMetadata((prev) => ({
                                    ...prev,
                                    videoDuration: duration, // Store the duration in video metadata
                                  }));
                                }}
                              />
                            </div>
                            <p className="text-customBlue font-extrabold">
                              {video.file.name}
                            </p>
                          </button>

                          {selectedVideo === video.url && (
                            <div className="flex flex-row mt-4 space-x-4" id='silentParams'>
                              <div className="mt-4">
                                <label htmlFor="noiseLevel" className="block text-sm font-medium text-customBlue">
                                  Noise Level (dB)
                                </label>
                                <select
                                  id="noiseLevel"
                                  value={noiseLevel}
                                  onChange={(e) => setNoiseLevel(e.target.value)}
                                  className="border border-customBlue rounded px-2 py-1 mt-1 text-customBlue"
                                >
                                  {Array.from({ length: 81 }, (_, i) => -90 + i).map((level) => (
                                    <option key={level} value={level}>
                                      {level} dB
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="mt-4">
                                <label htmlFor="silenceDuration" className="block text-sm font-medium text-customBlue">
                                  Silence Duration (seconds)
                                </label>
                                <select
                                  id="silenceDuration"
                                  value={silenceDuration}
                                  onChange={(e) => setSilenceDuration(e.target.value)}
                                  className="border border-customBlue rounded px-2 py-1 mt-1 text-customBlue"
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

                {!processingComplete && requestId && <VideoProgress requestId={requestId} />}
                
                {errorMessage && (<div className="mt-4 text-red-500"><p>{errorMessage}</p></div>)}
                <VideoList key={reloadVideoList} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Process;