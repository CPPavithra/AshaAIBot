import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./EditProfile.css"; // Create this CSS file

const EditProfile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //const email = queryParams.get("email");
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    age: "",
    phone: "",
    experience: "",
    skillset: "",
    resume: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!email) {
      setError("Email not found in URL.");
      return;
    }

    axios
      .get(`https://ashaaibot-backend.onrender.com/user?email=${encodeURIComponent(email)}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data for editing.");
      });
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put(
        `https://ashaaibot-backend.onrender.com/user?email=${encodeURIComponent(email)}`,
        user
      );

      if (response.status === 200) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          navigate(`/profile?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    navigate(`/profile?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]+"
            title="Name should contain only letters and spaces"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={user.age || ""}
            onChange={handleChange}
            required
            min="18"
            max="100"
            title="Age should be between 18 and 100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            required
            pattern="^\d{10}$"
            title="Phone number should be a 10-digit number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience (years):</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={user.experience || ""}
            onChange={handleChange}
            required
            min="0"
            max="50"
            title="Experience should be between 0 and 50 years"
          />
        </div>

        <div className="form-group">
          <label htmlFor="skillset">Skillset (comma-separated):</label>
          <textarea
            id="skillset"
            name="skillset"
            value={user.skillset || ""}
            onChange={handleChange}
            required
            minLength="5"
            title="Skillset should have at least 5 characters"
          />
        </div>

        {/* Consider adding a file input for resume update if needed */}

        <div className="button-group">
          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

