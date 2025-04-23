import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import robotLogo from '../assets/robot.gif'; // For the small logo
import robotMain from '../assets/robot.gif'; // For the main robot image

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };
  return (
    <div className="app-container">
      <div className="status-bar">
        <div className="time"></div>
        <div className="status-icons">
          <div className="cellular-icon"></div>
          <div className="battery-icon"></div>
        </div>
      </div>
      
      <div className="purple-section">
        <div className="header">
          <div className="logo-container">
            <img src={robotLogo} alt="Smart AI Logo" className="robot-logo" />
          </div>
          <h1 className="app-title">Asha AI</h1>
        </div>
        
        <div className="main-robot">
          <img src={robotMain} alt="Robot Character" className="main-robot-img" />
        </div>
      </div>
      
      <div className="white-section-home">
        <div className="app-info">
          <h2 className="app-name">Asha AI - Fueling Women’s Success</h2>
          <p className="app-description">
"Welcome to Asha! Your AI-powered career companion<br/>
specially tailored for women. Explore job opportunities,<br/>
connect with mentors,and unlock resources to empower<br/>
your professional journey.<br/>"
          </p>
  <h2 className="app-name">Ask Away!</h2>
        </div>
        
       <div className="button-container">
          <button className="login-button" onClick={handleLoginClick}>Log In</button>
          <button className="signup-button" onClick={handleSignupClick}>Sign up</button>
        </div>      </div>
    </div>
  );
}

export default Home;
