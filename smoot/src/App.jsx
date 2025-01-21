import React from 'react';
import HomePage from './components/homePage';
import Process from './components/process';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

const App = () =>{
  return (
        
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/process" element={<Process />} />
            <Route />
          </Routes>
        </div>
      </Router>
    
  )
};

export default App;
