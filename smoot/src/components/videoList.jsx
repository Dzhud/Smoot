import React, { useEffect, useState } from 'react';
import axios from 'axios';


const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
        setFilteredVideos(response.data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchVideos();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let sortedVideos = [...videos];
    if (sortConfig.key) {
      sortedVideos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredVideos(sortedVideos);
  }, [sortConfig, videos]);

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return <span className="inline-block ml-2 transform rotate-180 text-customBlue">&#9650;</span>; // Up arrow
      } else {
        return <span className="inline-block ml-2 text-customBlue">&#9650;</span>; // Down arrow
      }
    } else {
      return <span className="inline-block ml-2 text-gray-400">&#9650;</span>; // Default arrow
    }
  };




  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Processed Videos</h2>
      
      {errorMessage && (
        <div className="text-red-500 mb-4">
          <p>{errorMessage}</p>
        </div>
      )}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('name')}>
              Name {getSortIcon('name')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('editedFilePath')}>
              Edited File Path {getSortIcon('editedFilePath')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('creationDate')}>
              Creation Date {getSortIcon('creationDate')}
            </th>
          </tr>
        </thead>
        <tbody>


          {filteredVideos.map((video) => (
            <tr key={video._id}>
              <td className="py-2 px-4 border-b w-5">{video.metaData.name}</td>
              <td className="py-2 px-4 border-b">
                <video controls className="w-64 h-36 rounded-lg">
                  <source src={`http://localhost:5000/${video.processData.editedFilePath}`} type="video/mp4" />
               
                </video>
                </td>
              <td className="py-2 px-4 border-b">{new Date(video.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoList;