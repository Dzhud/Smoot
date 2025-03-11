import React from 'react';
import { useNavigate } from 'react-router-dom';


const Middle = () => {

    const navigate = useNavigate();
    const handleClick = () => {
         navigate('/process'); 
        };

    const styleMidBg = {
        backgroundColor: 'white',
        height: '500px',    
    } 
    
    const title = {
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: '#4D4DE6'
        
    }

   
    return(
        <div>
            <div style= {styleMidBg}>
                <h1 style={title} className="text-5xl p-20 font-bold underline">Industry Analysis</h1>
                <div className="flex items-center justify-between m-20 rounded-lg">
                    <div className="flex-1 p-2 left">
                        <h1 className="text-3xl font-bold">Industry Overivew</h1>
                        <div className='font-extrabold'>The video editing software industry serves the media and entertainment sector.
                            focusing on tools with automated features
                            like background noise removal, silence
                            detection, and captioning. The industry
                            operates globally, with strong usage in the
                            U.S., India, and China, driven by growing
                            demand for digital media.
                        </div>
                    </div>
                    <div className="flex-1 p-2 left">
                        <h1 className="text-3xl font-bold">UI Language</h1>
                            <div className='font-extrabold'>Clean interfaces, drag-and-drop functionality, real-
                                time previews, and dark mode are standard.
                                Professional tools offer customizable interfaces
                                with responsive designs for cross-platform use.
                            </div>
                    </div>
                </div>
            
            
                <div className="flex justify-center mt-6">
                    <button onClick={handleClick} className="px-8 py-4 bg-customBlue text-xl  font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{color: 'white'}}>
                    Click To Start
                    </button>
                </div>

            </div>
            <hr></hr>
            <div>
            <h1 style={title} className="text-5xl p-20 font-bold underline">Challenges</h1>
            <div className="flex items-center justify-between m-20 rounded-lg">
                <div className="flex-1 p-2 left">
                <h1 className="text-3xl font-bold">Noise Detection</h1>
                <div className='font-extrabold'>
                    Automated noise detection and removal tools are
                    essential for video editing software. These tools
                    help users quickly identify and remove unwanted
                    background noise from video and audio files.
                </div>
                </div>
                <div className="flex-1 p-2 left">
                <h1 className="text-3xl font-bold">Silence Detection</h1>
                <div className='font-extrabold'>
                    Silence detection tools help users identify and remove
                    periods of silence in audio files. These tools are
                    useful for creating professional-quality audio
                    tracks and removing unwanted noise from video
                    files.
                </div>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-customBlue text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ color: 'white', marginBottom: '20px' }}
                >
                Go to Login
                </button>
            </div>
            </div>

        </div>
    )
}


export default Middle;