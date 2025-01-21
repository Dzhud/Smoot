import React from 'react';
//import { Link } from 'react-router-dom';


const Navbar = () => {
  const header = {
    height: '800px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#4D4DE6',
    color: 'white',
    //fontFamily: "'Arial', sans-serif",
    fontFamily: "'Inter var', sans-serif",
    padding: '50px 20px'
  
  }
  const hStyle = {
    fontSize: '150px',
    fontWeight: 'bold',
    margin: '0',
    position: 'relative',
    marginBottom: '-35px',
    
    
  }
  const leftSide = {
    textAlign: 'left', paddingLeft: '50px', paddingTop: '200px'
  }
  const forImg= {
    marginRight: '-20px'
  }

  return (
    <div style={header}>
        <div style={leftSide}>
          <h1 className="text-1xl font-bold underline" style={hStyle}>Smoot</h1>
          <h2 className="text-3xl font-bold"> Seamless AI-Powered Video Editing <br />
           for Effortless Perfection. </h2>
        </div>      
        <img src='/overview.png' loading='lazy' alt='snapshot' style={forImg}/>


    </div>
  )
}

export default Navbar;