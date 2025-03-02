import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


const VideoDropZone = ({ onFilesAdded }) => {
  
  const [alert, setAlert] = useState('');
  const onDrop = useCallback((acceptedFiles) => {
    onFilesAdded(acceptedFiles);
    setAlert('');
  }, [onFilesAdded]);

  const onDropRejected = useCallback((fileRejections) => {
    // Show an alert for each rejected file
    fileRejections.forEach((file) => {
      setAlert(`File ${file.file.name} is not a supported video format.`);
    });
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
    'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-customBlue rounded p-6 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className=" text-customBlue font-extrabold">Drop the videos here ...</p>
      ) : (
        <p className=" text-customBlue font-extrabold">Drag & drop some videos here, or click to select videos</p>
      )}
      {alert && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {alert}
        </div>)}

     



    </div>
  );
};

export default VideoDropZone;
