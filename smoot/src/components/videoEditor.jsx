import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import '../styles/customStyles.css';
import { PlayIcon, PauseIcon, FastForwardIcon, XCircleIcon,
  VolumeOffIcon, VolumeUpIcon, RewindIcon } from "@heroicons/react/outline";

const VideoEditor = ({ url }) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [seekTime, setSeekTime] = useState(0);
  const [showPlaybackSpeed, setShowPlaybackSpeed] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  const handlePlayPause = () => setPlaying((prev) => !prev);
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
  const handleMute = () => setMuted((prev) => !prev);
  const handlePlaybackRateChange = (e) => setPlaybackRate(e);
  const handleSeek = (time) => {
    setSeekTime(time);
    playerRef.current.seekTo(time, 'seconds');
  };
  const handleFastForward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    handleSeek(currentTime + 10); // Fast forward 10 seconds
  };
  const handleRewind = () => {
    const currentTime = playerRef.current.getCurrentTime();
    handleSeek(Math.max(currentTime - 10, 0)); // Rewind 10 seconds
  };
  const togglePlaybackSpeed = () => setShowPlaybackSpeed((prev) => !prev);
  const handleClose = () => {
    setShowPlayer(false);
    };

  
  if (!showPlayer) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    <div className="relative rounded-lg overflow-hidden">
    <h2 className="text-xl font-semibold">Edit Video</h2> 
      <div className="relative">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={({ playedSeconds }) => {setSeekTime(playedSeconds)}}
          controls={false}
          width="100%"
          height="auto"
          className='react-player'
        />
        <button
          onClick={handleClose} aria-label='close'>
        <XCircleIcon className="h-8 w-8 text-customBlue absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-700 transition duration-300" />
        </button>
      </div>
      
      <div className="controls flex items-center space-x-4 justify-center mt-4 hover:cursor-pointer">
        <button onClick={handleRewind} className="flex items-center space-x-1"> 
          <RewindIcon className="h-6 w-6 text-customBlue" />
        </button> 
        <button onClick={handlePlayPause} className="flex items-center space-x-1"> 
          {playing ? <PauseIcon className="h-6 w-6 text-customBlue" /> : <PlayIcon className="h-6 w-6 text-customBlue" />}
        </button>
        <button onClick={handleFastForward} className="flex items-center space-x-1"> 
          <FastForwardIcon className="h-6 w-6 text-customBlue" />
        </button>
        <button onClick={handleMute} className="flex items-center space-x-1"> 
          {muted || volume === 0 ? (
                <VolumeOffIcon className="h-6 w-6 text-customBlue" />
              ) : (
                <VolumeUpIcon className="h-6 w-6 text-customBlue" />
              )}          
        </button> 
        <div className="mt-2 text-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="input-range"
            disabled={muted}
          />
        </div>
        
        <div className="mt-2 text-center">
        {showPlaybackSpeed && (
        <div className="mt-4">
          <select
            value={playbackRate}
            onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      )}
    </div>

        <div className="mt-2 text-center">
          <button
            onClick={togglePlaybackSpeed}
            className="btn bg-customBlue text-white px-4 py-2 rounded font-bold">
            {showPlaybackSpeed ? "Hide Speed" : "Show Speed"}
          </button>         
        </div>
       
      

      

      </div>
    </div>
    </div>
  );
};

export default VideoEditor;
