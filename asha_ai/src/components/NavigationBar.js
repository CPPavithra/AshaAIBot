import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaCommentDots, FaTachometerAlt, FaCogs, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import './NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authToken = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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

  const navigateToChatbot = () => {
    navigate(`/chat?email=${encodeURIComponent(email)}`);
  };

  const navigateToFeatures = () => {
    navigate('/chatbot');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className="navigation-bar">
      <ul className="nav-list">
        <li className="nav-item">
          <div
            onClick={navigateToChatbot}
            className={`nav-link ${
              location.pathname === '/chat' && location.search.includes(`email=${encodeURIComponent(email)}`)
                ? 'active'
                : ''
            }`}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#663399',
              padding: '8px 10px',
              borderRadius: '15px'
            }}
          >
            <span className="nav-icon"><FaCommentDots /></span>
            <span className="nav-text">Chat</span>
          </div>
        </li>
        <li className="nav-item">
          <NavLink
            to={authToken && userEmail ? `/dashboard?email=${encodeURIComponent(userEmail)}` : '/login'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaTachometerAlt /></span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>
                <li className="nav-item">
          <NavLink
            to={authToken && userEmail ? `/profile?email=${encodeURIComponent(userEmail)}` : '/login'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaUserCircle /></span>
            <span className="nav-text">Account</span>
          </NavLink>
        </li>
        {authToken && (
          <li className="nav-item logout-item">
            <div
              onClick={handleLogout}
              className="nav-link"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#663399',
                padding: '8px 10px',
                borderRadius: '15px'
              }}
            >
              <span className="nav-icon"><FaSignOutAlt /></span>
              <span className="nav-text">Logout</span>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;

