import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FaCommentDots, FaTachometerAlt, FaCogs, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object using the hook
  const authToken = localStorage.getItem('authToken'); // Get the token
  const userEmail = localStorage.getItem('userEmail'); // Get the email

  const navigateToChatbot = () => {
    navigate('/chatbot');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/'); // Or navigate to the login page, depending on your preference
  };

  return (
    <nav className="navigation-bar">
      <ul className="nav-list">
        <li className="nav-item">
          <div
            onClick={navigateToChatbot}
            className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#663399', padding: '8px 10px', borderRadius: '15px' }}
          >
            <span className="nav-icon"><FaCommentDots /></span>
            <span className="nav-text">Chat</span>
          </div>
        </li>
        <li className="nav-item">
          <NavLink
            to={authToken && userEmail ? `/dashboard?email=${encodeURIComponent(userEmail)}` : '/login'}
            activeClassName="active"
          >
            <span className="nav-icon"><FaTachometerAlt /></span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div
            onClick={navigateToChatbot}
            className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#663399', padding: '8px 10px', borderRadius: '15px' }}
          >
            <span className="nav-icon"><FaCogs /></span>
            <span className="nav-text">Features</span>
          </div>
        </li>
        <li className="nav-item">
          <NavLink
            to={authToken && userEmail ? `/profile?email=${encodeURIComponent(userEmail)}` : '/login'}
            activeClassName="active"
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
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#663399', padding: '8px 10px', borderRadius: '15px' }}
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
