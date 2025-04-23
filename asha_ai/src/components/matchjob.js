// matchjob.js
import React, { useState, useEffect } from 'react';
import './matchjob.css';


const MatchJob = () => {
  const [email, setEmail] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchJobs = async () => {
    setLoading(true);
console.log('Email:', email);
    try {
      const response = await fetch('http://localhost:5000/matchjob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      handleFetchJobs();  // Fetch jobs whenever email changes
    }
  }, [email]);  
return (
    <div className="matchjob-container">
      <h2>🔍 Job Recommendations</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="matchjob-input"
      />
      <button onClick={handleFetchJobs} className="matchjob-button">
        {loading ? 'Finding Jobs...' : 'Match My Skills'}
      </button>

      {recommendations && (
        <div className="matchjob-results">
          <h3>🧠 Based on your skills:</h3>
          <div className="jobs-list">
            {recommendations.jobs?.map((job, i) => (
              <div className="job-card" key={i}>
                <h4>{job.role}</h4>
                <p><strong>Companies:</strong> {job.companies.join(', ')}</p>
              </div>
            ))}
          </div>

          <h3>💼 Freelance/Alternative Paths:</h3>
          <ul>
            {recommendations.freelance?.map((idea, i) => (
              <li key={i}>{idea}</li>
            ))}
          </ul>

          <h3>📚 Recommended Skills to Learn:</h3>
          <ul>
            {recommendations.next_skills?.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchJob;

