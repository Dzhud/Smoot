// src/Silencer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import VideoDropzone from './videoDropZone.jsx';
import VideoEditor from './videoEditor.jsx';

const Silencer = () => {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [processedVideo, setProcessedVideo] = useState(null);

  const handleFilesAdded = async (files) => {
    setUploadedVideo(files[0]);
    const formData = new FormData();
    formData.append('video', files[0]);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      setProcessedVideo(url);
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  return (
    <div className="silencer">
      <h1 className="text-3xl font-bold text-center mt-4">Video Silence Remover</h1>
      <VideoDropzone onFilesAdded={handleFilesAdded} />
      {uploadedVideo && (
        <div className="mt-4">
          <p>Uploaded Video: {uploadedVideo.name}</p>
          <VideoEditor url={URL.createObjectURL(uploadedVideo)} />
        </div>
      )}
      {processedVideo && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Processed Video:</h2>
          <video controls src={processedVideo} className="mt-4 w-full" />
        </div>
      )}
    </div>
  );
};

export default Silencer;