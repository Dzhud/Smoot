import React from 'react';
import HomePage from './components/homePage';
import Process from './components/process';
import Login from './components/login';
import Signup from './components/signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

const App = () =>{
  return (
        
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/process" element={<Process />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route />
          </Routes>
        </div>
      </Router>
    
  )
};

export default App;
