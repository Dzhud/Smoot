import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoProgress = ({ requestId }) => {
    const [status, setStatus] = useState("Waiting...");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleProgressUpdate = (data) => {
            if (data.requestId === requestId) {
                setStatus(`Status: ${data.message}`);
                if (data.progress !== undefined) {
                    setProgress(data.progress);
                }
            }
        };

        socket.on("processing_started", handleProgressUpdate);
        socket.on("processing_progress", handleProgressUpdate);
        socket.on("processing_complete", handleProgressUpdate);
        socket.on("processing_failed", handleProgressUpdate);

        return () => {
            socket.off("processing_started", handleProgressUpdate);
            socket.off("processing_progress", handleProgressUpdate);
            socket.off("processing_complete", handleProgressUpdate);
            socket.off("processing_failed", handleProgressUpdate);
        };
    }, [requestId]);

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">{status}</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            {status === "Video processing complete!" && (
                <p className="text-green-500 mt-2">Video processing completed successfully!</p>
            )}
            {status === "Video processing failed. Please try again." && (
                <p className="text-red-500 mt-2">Video processing failed. Please try again.</p>
            )}
        </div>
    );
};

export default VideoProgress;