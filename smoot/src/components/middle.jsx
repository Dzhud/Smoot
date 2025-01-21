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
                <button onClick={handleClick} className="px-8 py-4 bg-customBlue text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Click To Start
                </button>
            </div>
            


        </div>
    )
}


export default Middle;