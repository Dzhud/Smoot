import React from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/process');
};



  return (
    <div style={{ position: 'static' }}>
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav style={{ height: '10vh'}} className="flex items-center justify-between py-6">
            <div className="text-white text-2xl font-bold">
              <a href='/'><img src='/smt.png' alt='logo' className='h-16 w-auto mx-auto'/></a>
            </div>
            <div className="hidden md:flex space-x-4" style={{ fontFamily: 'montserrat', fontSize: '20px', fontWeight: 'bold' }}>
              <a href="#features" className="text-customBlue hover:text-yellow-500 hover:underline">Features</a>
              <a href="#testimonials" className="text-customBlue hover:text-yellow-500 hover:underline">Testimonials</a>
              <a href="#contact" className="text-customBlue hover:text-yellow-500 hover:underline">Contact</a>
              <button className="text-customBlue hover:text-yellow-500 hover:underline" onClick={handleLogin}>Login</button>
            </div>
          </nav>
        </div>
        </div>

   
    </div>
  )
}

export default Navbar;