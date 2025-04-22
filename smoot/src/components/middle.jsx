import React from 'react';
import { useNavigate } from 'react-router-dom';

const Middle = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/process');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    const header = {
        height: '800px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        //backgroundColor: '#4D4DE6',
        backgroundColor: 'white',
        color: 'white',
        //fontFamily: "'Arial', sans-serif",
        fontFamily: 'montserrat',
        padding: '50px 20px',
        borderRadius: '10px',
      
      }
      const hStyle = {
        fontSize: '150px',
        fontWeight: 'bold',
        margin: '0',
        position: 'relative',
        marginBottom: '-35px',
        animation: 'flyInFromLeft 1s ease-out',
        color: '#4D4DE6',
      
        
        
      }
      const hStyle2 = { 
        animation: 'flyInFromRight 1s ease-out',
        color: '#4D4DE6',
      }
      const leftSide = {
        textAlign: 'left', paddingLeft: '50px', paddingTop: '200px'
      }
    

    const titleStyle = {
        margin: '0',
        //boxSizing: 'border-box',
        justifyContent: 'center',
        textAlign: 'center',

       // color: '#4D4DE6',
        color: '#484644',
        fontFamily: 'montserrat',
        //backgroundColor: '#eed349',
        backgroundColor: '#f8e69a',
        padding: '20px',
        borderRadius: '80px',
        
       
    };
    const bluz1 = '#7a92f0';
    const yelz1 = '#f0ecaf';
    const blackz1 = '#B4B2B0';
    const ble1 = '#c9f2f1';
    const bluz = {
        backgroundColor: bluz1,
        padding: '40px',
        borderRadius: '40px',
        fontFamily: 'montserrat',
        
    }
    const yelz = {
        backgroundColor: yelz1,
        padding: '40px',
        borderRadius: '40px',
        fontFamily: 'montserrat',
    }
    const blackz = {
        backgroundColor: blackz1,
        padding: '40px',
        borderRadius: '40px',
        fontFamily: 'montserrat',
    }
    const ble={
        backgroundColor: ble1,
        padding: '40px',
        borderRadius: '40px',
        fontFamily: 'montserrat',
    }

    return (
        <div>
             <div style={header}>
                <div style={leftSide}>
                <h1 className="text-1xl font-bold underline" style={hStyle}>Smoot</h1>
                <h2 className="text-3xl font-bold" style={hStyle2}> Seamless AI-Powered Video Editing <br />
                for Effortless Perfection. </h2>
                </div>      
                {/*<img className= 'w-auto' src='/overview.png' loading='lazy' alt='snapshot' style={forImg}/>*/}
                <svg className="animate-jump animate-flyInFromRight" id="sw-js-blob-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                    <stop id="stop1" stop-color="rgba(77, 77, 230, 1)" offset="0%"></stop>
                    <stop id="stop2" stop-color="rgba(226.611, 158.084, 198.852, 1)" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <path
                    fill="url(#sw-gradient)"
                    d="M25,-26.3C30.2,-19.8,30.7,-9.9,29.9,-0.8C29,8.2,26.8,16.4,21.6,21.9C16.4,27.4,8.2,30.3,0.2,30.1C-7.9,30,-15.8,26.8,-23.8,21.3C-31.8,15.8,-39.9,7.9,-40.2,-0.3C-40.5,-8.6,-33.1,-17.2,-25.2,-23.7C-17.2,-30.2,-8.6,-34.7,0.7,-35.3C9.9,-36,19.8,-32.8,25,-26.3Z"
                    width="100%"
                    height="100%"
                    transform="translate(50 50)"
                    stroke-width="0"
                    className="transition-all duration-300"
                ></path>
                <image
                    href="/cur.png"
                    x="0"
                    y="0"
                    width="90%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                />
                </svg>
                                
                
    
        </div>

            {/* Hero Section */}
            <div className="bg-gray-100 py-20">
            <div className="grid rounded-full place-items-center justify-center items-center">

            <h1 style={titleStyle} className="text-5xl font-bold">Revolutionize Your Video Editing</h1>

                </div>
                {/*<h1 style={titleStyle} className="text-5xl font-bold">Revolutionize Your Video Editing</h1>*/}
                <p className="text-2xl text-gray-600 text-center mt-4">
                    Automate silence detection, noise removal, and more with our cutting-edge video editing tools.
                </p>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-4 bg-customBlue text-xl font-bold rounded-lg shadow-lg transition-transform duration-700 ease-in-out hover:scale-110"
                        style={{ color: 'white', fontFamily: 'montserrat' }} 
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20" style={{ color: '#f5fcfc' }} id="features">
                <div className="grid rounded-full place-items-center justify-center items-center">
                    <h1 style={titleStyle} className="text-4xl font-bold">Features</h1>
                    </div>
                    {/*<h1 style={titleStyle} className="text-4xl font-bold">Features</h1>*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-20">
                        <div className="text-center transition-transform duration-700 ease-in-out hover:scale-110 "  style={bluz}>
                            <img src="/icons/silence-detection.png" alt="Silence Detection" className="w-36 mx-auto rounded-lg" />
                            <h2 className="font-greek text-xl text-customBlue font-bold mt-4">Silence Detection</h2>
                            <p className=" text-gray-600 font-bold mt-2">Automatically detect and remove silent segments from your videos.</p>
                        </div>
                        <div className="text-center animate-flyInFromLeft transition-transform duration-700 ease-in-out hover:scale-110" style={yelz}>
                            <img src="/icons/noise-removal.png" alt="Noise Removal" className="w-36 mx-auto rounded-lg" />
                            <h2 className="text-xl text-customBlue font-bold mt-4">Noise Removal</h2>
                            <p className="text-gray-600 font-bold mt-2">Eliminate background noise for crystal-clear audio.</p>
                        </div>
                        <div className="text-center animate-flyInFromRight transition-transform duration-700 ease-in-out hover:scale-110" style={blackz}>
                            <img src="/icons/real-time.png" alt="Real-Time Processing" className="w-36 mx-auto rounded-lg" />
                            <h2 className="text-xl text-customBlue font-bold mt-4">Real-Time Processing</h2>
                            <p className="text-gray-600 font-bold mt-2">Edit videos with instant feedback and previews.</p>
                        </div>
                        <div className="text-center animate-flyInFromRight transition-transform duration-700 ease-in-out hover:scale-110" style={ble}>
                            <img src="/icons/cross-platform.png" alt="Cross-Platform" className="w-36 mx-auto rounded-lg" />
                            <h2 className="text-xl text-customBlue font-bold mt-4">Cross-Platform</h2>
                            <p className="text-gray-600 font-bold mt-2">Works seamlessly on desktop and mobile devices.</p>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-gradient-to-r from-customBlue to-brightYellow py-20 font-montserrat animate-flyInFromBottom">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-8">Why Choose Us?</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 md:px-20">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <img src="/icons/time-passing.png" alt="Save Time" className="w-10 h-10 mr-4" />
                                <h2 className="text-2xl font-bold text-customBlue">Save Time</h2>
                            </div>
                            <p className="text-gray-600">
                                Automate tedious editing tasks like silence detection and noise removal.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <img src="/icons/product.png" alt="Professional Quality" className="w-10 h-10 mr-4" />
                                <h2 className="text-2xl font-bold text-customBlue">Professional Quality</h2>
                            </div>
                            <p className="text-gray-600">
                                Enhance your videos with tools designed for professionals.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <img src="/icons/easy.png" alt="Easy to Use" className="w-10 h-10 mr-4" />
                                <h2 className="text-2xl font-bold text-customBlue">Easy to Use</h2>
                            </div>
                            <p className="text-gray-600">
                                Our intuitive interface makes video editing simple and accessible.
                            </p>
                        </div>
                    </div>
            </div>

            {/* Testimonials Section */}
            <div id="testimonials" className="bg-white py-20 font-montserrat text-customLight2" style={{ fontWeight: 'bold' }}>
                <div className="grid rounded-full place-items-center justify-center items-center">
                    <h1 style={titleStyle} className="text-4xl font-bold">What Our Users Say</h1>
                </div>
                {/*<h1 style={titleStyle} className="text-4xl font-bold">What Our Users Say</h1>*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-20 animate-pulse">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <p className="text-gray-600">"This app saved me hours of editing time. The silence detection feature is a game-changer!"</p>
                        <h3 className="text-xl font-bold mt-4">- John Doe</h3>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <p className="text-gray-600">"The noise removal tool is amazing. My videos sound so much better now!"</p>
                        <h3 className="text-xl font-bold mt-4">- Jane Smith</h3>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <p className="text-gray-600">"I love how easy it is to use. The interface is clean and intuitive."</p>
                        <h3 className="text-xl font-bold mt-4">- Alex Johnson</h3>
                    </div>
                </div>
            </div>

            {/* Call-to-Action Section */}
            <div className="bg-gray-100 py-20 animate-flyInFromBottom" style={{ backgroundSize: '200px 200px', backgroundPosition: 'center',  backgroundImage: 'url(/icons/DancingDoodle.png)' }}>
                <div className="flex justify-center">
                    <button
                        onClick={handleSignUp}
                        className="px-8 py-4 bg-customBlue text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ color: 'white' }}
                    >
                        Sign Up Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Middle;