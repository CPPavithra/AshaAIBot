import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import resumelogo from '../assets/resumelogo.png'
import career from '../assets/career.png'
import pwc from '../assets/pwc.png'
import "./Dashboard.css";

const Dashboard = ({ userEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  useEffect(() => {
    if (!email) {
      setError("Email not found in URL.");
      return;
    }

    axios
      .get(`http://localhost:5000/user?email=${encodeURIComponent(email)}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      });
  }, [email]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="error-message">Loading...</div>;
  }

  const handlePromptClick = (prompt) => {
    navigate("/chatbot", { state: { query: prompt } });
  };

  return (
    <div className="dashboard-container">
      <div className="profile-icon" onClick={() => navigate(`/profile?email=${encodeURIComponent(email)}`)}>
        <FaUserCircle size={40} />
      </div>

      <h2 className="welcome-text">Welcome back, {user.name}</h2>
      <h3 className="chat-title">Smart AI Here! How can I help you?</h3>

      <section className="trending-section">
        <h4>Trending Prompt</h4>
        <div className="trending-prompts">
          <button className="sleek-button" onClick={() => handlePromptClick("Artificial intelligence")}>
            #1 Artificial intelligence
          </button>
          <button className="sleek-button" onClick={() => handlePromptClick("Data scientists")}>
            #2 Data scientists
          </button>
          <button className="sleek-button" onClick={() => handlePromptClick("UX UI Design Road Map")}>
            #3 UX UI Design Road Map
          </button>
          <button className="sleek-button" onClick={() => handlePromptClick("Healthy food lists")}>
            #4 Healthy food lists
          </button>
        </div>
      </section>

      <section className="new-updates">
        <h4>New Updates ✨</h4>
        <div className="features">
          <div className="feature-box">
            <h4>Match Resume <br/>with Jobs</h4>
            <img src={resumelogo} alt="logo resume" className="logo-img" />
          </div>
          <div className="feature-box">
            <h4>Career Path Recommender</h4>
            <img src={career} alt="path recommender" className="logo-img" />
          </div>
          <div className="feature-box">
            <h4>Diversity Score Viewer</h4>
             <img src={pwc} alt="pwc" className="logo-img" />
          </div>
        </div>
      </section>

      <button className="sleek-button generate-chat" onClick={() => navigate("/chatbot")}>Chatbot</button>
</div>
  );
};

export default Dashboard;
