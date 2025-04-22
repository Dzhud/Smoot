import React from 'react';


const Footer = () => {
  const styleFootBg = {
    backgroundColor: "#4D4DE6",
    color: "white",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  };

  const styleContent = {
    marginBottom: "15px",
  };

  const styleHeading = {
    fontSize: "24px",
    margin: "0",
    fontWeight: "bold",
  };

  const styleParagraph = {
    margin: "5px 0",
    fontSize: "14px",
  };

  const styleLinks = {
    margin: "10px 0",
  };

  const styleLink = {
    margin: "0 10px",
    color: "white",
    textDecoration: "none",
    fontSize: "14px"
  };

  const styleCredits = {
    fontSize: "12px",
    opacity: "0.8"
  };

  return (
    <div style={styleFootBg} id='contact'>
      <div style={styleContent}>
        <h4 style={styleHeading}>Smoot</h4>
        <p style={styleParagraph}>
          Seamlessly powered by AI to remove unwanted spaces in your videos,
          making editing effortless.
        </p>
      </div>
      <div style={styleLinks}>
        <a href="/" style={styleLink}>
          Terms of Service
        </a>
        <a href="/" style={styleLink}>
          Privacy Policy
        </a>
        <a href="/" style={styleLink}>
          Contact Us
        </a>
      </div>
      <div style={styleCredits}>
        <p>© {new Date().getFullYear()} Smoot. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

