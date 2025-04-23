import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import robotLogo from '../assets/robot.gif';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    experience: '',
    skillset: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleResumeChange = (e) => {
    if (e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const fullForm = new FormData();
    fullForm.append('name', formData.name);
    fullForm.append('age', formData.age);
    fullForm.append('gender', formData.gender);
    fullForm.append('phone', formData.phone);
    fullForm.append('experience', formData.experience);
    fullForm.append('skillset', formData.skillset);
    fullForm.append('email', formData.email);
    fullForm.append('password', formData.password);

    if (profilePic) fullForm.append('profile_pic', profilePic);
    if (resume) fullForm.append('resume', resume);

    try {
      const response = await fetch('https://ashaaibot-backend.onrender.com/signup', {
        method: 'POST',
        body: fullForm
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <div className="signup-container">
      <div className="status-bar">
        <div className="time">8:15</div>
        <div className="status-icons">
          <div className="cellular-icon"></div>
          <div className="wifi-icon"></div>
          <div className="battery-icon"></div>
        </div>
      </div>
      
      <div className="purple-section-signup">
        <div className="header">
          <div className="logo-container">
            <img src={robotLogo} alt="Smart AI Logo" className="robot-logo" />
          </div>
          <h1 className="app-title">Asha-AI</h1>
        </div>
      </div>
      
      <div className="white-section-signup">
        <h2 className="form-title">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input 
              type="number" 
              id="age"
              name="age" 
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePic">Profile Picture</label>
            <div className="file-upload">
              <input 
                type="file" 
                id="profilePic"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
              <span className="file-upload-text">
                {profilePic ? profilePic.name : "Choose a file"}
              </span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Male
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Female
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="gender" 
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                />
                Other
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <input 
              type="text" 
              id="experience"
              name="experience" 
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of experience"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="skillset">Skillset</label>
            <textarea 
              id="skillset"
              name="skillset" 
              value={formData.skillset}
              onChange={handleChange}
              placeholder="List your skills separated by commas"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="resume">Resume</label>
            <div className="file-upload">
              <input 
                type="file" 
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
              <span className="file-upload-text">
                {resume ? resume.name : "Upload your resume"}
              </span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Set your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
            />
          </div>
          
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        
        <div className="redirect-login">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

