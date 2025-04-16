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
            {/* Hero Section */}
            <div className="bg-gray-100 py-20">
            <div
        className="grid rounded-full place-items-center justify-center items-center"
        >
            <h1 style={titleStyle} className="text-5xl font-bold">Revolutionize Your Video Editing</h1>

                </div>
                {/*<h1 style={titleStyle} className="text-5xl font-bold">Revolutionize Your Video Editing</h1>*/}
                <p className="text-2xl text-gray-600 text-center mt-4">
                    Automate silence detection, noise removal, and more with our cutting-edge video editing tools.
                </p>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-4 bg-customBlue text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ color: 'white', fontFamily: 'montserrat' }} 
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20" style={{ color: '#f5fcfc' }}>
                <div className="grid rounded-full place-items-center justify-center items-center">
                    <h1 style={titleStyle} className="text-4xl font-bold">Features</h1>
                    </div>
                    {/*<h1 style={titleStyle} className="text-4xl font-bold">Features</h1>*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-20">
                        <div className="text-center animate-flyInFromLeft" style={bluz}>
                            <img src="/icons/silence-detection.png" alt="Silence Detection" className="w-36 mx-auto rounded-lg" />
                            <h2 className="font-greek text-xl text-black font-bold mt-4">Silence Detection</h2>
                            <p className=" text-gray-600 mt-2">Automatically detect and remove silent segments from your videos.</p>
                        </div>
                        <div className="text-center animate-flyInFromLeft" style={yelz}>
                            <img src="/icons/noise-removal.png" alt="Noise Removal" className="w-36 mx-auto rounded-lg" />
                            <h2 className="text-xl text-black font-bold mt-4">Noise Removal</h2>
                            <p className="text-gray-600 mt-2">Eliminate background noise for crystal-clear audio.</p>
                        </div>
                        <div className="text-center animate-flyInFromRight" style={blackz}>
                            <img src="/icons/real-time.png" alt="Real-Time Processing" className="w-36 mx-auto rounded-lg" />
                            <h2 className="text-xl text-black font-bold mt-4">Real-Time Processing</h2>
                            <p className="text-gray-600 mt-2">Edit videos with instant feedback and previews.</p>
                        </div>
                        <div className="text-center animate-flyInFromRight" style={ble}>
                            <img src="/icons/cross-platform.png" alt="Cross-Platform" className="w-36 mx-auto rounded-lg" />
                            <h2 className="text-xl text-black font-bold mt-4">Cross-Platform</h2>
                            <p className="text-gray-600 mt-2">Works seamlessly on desktop and mobile devices.</p>
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
            <div className="bg-white py-20 font-montserrat text-customLight2" style={{ fontWeight: 'bold' }}>
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