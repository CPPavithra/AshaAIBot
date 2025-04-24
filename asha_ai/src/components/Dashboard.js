import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import resumelogo from '../assets/resumelogo.png';
import career from '../assets/career.png';
import pwc from '../assets/pwc.png';
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Retrieve email from localStorage
  const email = localStorage.getItem("userEmail");

  // ✅ Logout function (defined outside useEffect)
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  useEffect(() => {
    if (!email) {
      setError("Email not found in local storage.");
      return;
    }

    // ✅ Fetch user data from server
    axios
      .get(`https://ashaaibot-backend.onrender.com/user?email=${encodeURIComponent(email)}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      });
  }, [email]);

  // ✅ Handle loading or error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="error-message">Loading...</div>;
  }  // Navigate to the chatbot with the query parameter
   return (
    <div className="dashboard-container">
      {/* Profile icon - clicking redirects to profile page */}
      <div 
        className="profile-icon" 
        onClick={() => navigate(`/profile?email=${encodeURIComponent(email)}`)}
      >
        <FaUserCircle size={40} />
      </div>

      <h2 className="welcome-text">Welcome back, {user.name}</h2>
      <h3 className="chat-title">Smart AI Here! How can I help you?</h3>

      {/* Trending prompts section */} 
      {/* New Updates Section */}
      <section className="new-updates">
        <h4>Features We Offer</h4>
        <h5>Ask your career related queries and we will guide you with anything and everything possible! </h5>
        <div className="features">
          <div className="feature-box">
            <h4>Match Resume <br />with Jobs</h4>
            <Link to={`/matchjob?email=${encodeURIComponent(email)}`}>
              <img src={resumelogo} alt="logo resume" className="logo-img" />
            </Link>
          </div>

          <div className="feature-box">
            <h4>Search with HerKey</h4>
            <Link to={`/jobs?email=${encodeURIComponent(email)}`}>
              <img src={career} alt="path recommender" className="logo-img" />
            </Link>
          </div>

          <div className="feature-box">
            <h4>Diversity Score Viewer</h4>
            <Link to={`/diversity?email=${encodeURIComponent(email)}`}>
              <img src={pwc} alt="pwc" className="logo-img" style={{ cursor: "pointer" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot Button */}
      <button
        className="sleek-button generate-chat"
        onClick={() => navigate(`/chat?email=${encodeURIComponent(email)}`)}
      >
        Chatbot
      </button>
    </div>
  );
};

export default Dashboard;

