import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import robotLogo from '../assets/robot.gif';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      console.log('✅ Login successful:', data.user);

      // Store the token and email in localStorage
      localStorage.setItem('authToken', data.token); // Assuming your backend sends a 'token'
      localStorage.setItem('userEmail', data.user.email); // Assuming your backend sends user data with email

      navigate(`/dashboard?email=${encodeURIComponent(email)}`);

    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="status-bar">
        <div className="time">8:15</div>
        <div className="status-icons">
          <div className="cellular-icon"></div>
          <div className="wifi-icon"></div>
          <div className="battery-icon"></div>
        </div>
      </div>

      <div className="purple-section-login">
        <div className="header">
          <div className="logo-container">
            <img src={robotLogo} alt="Smart AI Logo" className="robot-logo" />
          </div>
          <h1 className="app-title">Asha-AI</h1>
        </div>
      </div>

      <div className="white-section-login">
        <h2 className="form-title">Log In</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-button">Log In</button>
        </form>

        <div className="redirect-signup">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
