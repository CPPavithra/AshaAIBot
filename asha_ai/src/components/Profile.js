import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // ✅ Get email from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 id="header-name">{user.name}</h1>
        <div className="profile-picture-container">
          <img
            id="profile-picture"
            src={user.profilePicture || "https://via.placeholder.com/80"}
            alt="Profile"
            className="profile-picture"
          />
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <i className="fas fa-user field-icon"></i>
          <span className="field-label">Name</span>
          <span id="name" className="field-value">{user.name}</span>
        </div>

        <div className="profile-field">
          <i className="fas fa-calendar field-icon"></i>
          <span className="field-label">Age</span>
          <span id="age" className="field-value">{user.age}</span>
        </div>

        <div className="profile-field">
          <i className="fas fa-phone field-icon"></i>
          <span className="field-label">Phone</span>
          <span id="phone" className="field-value">{user.phone}</span>
        </div>

        <h3 className="section-title">Professional Information</h3>

        <div className="profile-field">
          <i className="fas fa-briefcase field-icon"></i>
          <span className="field-label">Experience</span>
          <span id="experience" className="field-value">
            {user.experience} years
          </span>
        </div>

        <div className="profile-field">
          <i className="fas fa-code field-icon"></i>
          <span className="field-label">Skillset</span>
          <span id="skillset" className="field-value">
            {Array.isArray(user.skillset)
              ? user.skillset.join(", ")
              : typeof user.skillset === "string"
              ? user.skillset.split(",").join(", ")
              : "No skillset"}
          </span>
        </div>

        <div className="profile-field">
          <i className="fas fa-file-alt field-icon"></i>
          <span className="field-label">Resume</span>
          {user.resume ? (
            <a
              id="resume"
              href={user.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="field-value resume-link"
            >
              View Resume
            </a>
          ) : (
            <span className="field-value">No resume uploaded</span>
          )}
        </div>

        <div className="profile-field">
          <i className="fas fa-envelope field-icon"></i>
          <span className="field-label">Email</span>
          <span id="email" className="field-value">{user.email}</span>
        </div>
      </div>

      <button id="edit-profile-btn" className="edit-button" onClick={() => navigate(`/edit-profile?email=${encodeURIComponent(user.email)}`)}>
  Edit Profile
</button>    </div>
  );
};

export default Profile;

