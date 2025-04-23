import React, { useState } from 'react';
import axios from 'axios';
import './Jobs.css';

const JobsPage = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ashaaibot-backend.onrender.com/api/search_jobs', {
        params: { query, location }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      
<h2>🔍 Search Jobs</h2>
<div className="search-form">
  <input
    type="text"
    placeholder="Enter job field (e.g., AI Researcher)"
    value={query}
    onChange={e => setQuery(e.target.value)}
  />
  <br />
  <input
    type="text"
    placeholder="Enter location (e.g., India)"
    value={location}
    onChange={e => setLocation(e.target.value)}
  />
  <br />
  <button onClick={fetchJobs}>Search</button>
</div>
      {loading ? <p>Loading...</p> : (
        jobs.length > 0 ? (
          
<div className="job-listings">
  {jobs.map((job, idx) => (
    
<div key={idx} className="job-card">
  <h3 className="job-title">{job.title}</h3>
  <p className="job-company"><strong>Company:</strong> {job.company}</p>
  <p className="job-location"><strong>Location:</strong> {job.location}</p>
  <p className="job-description">{job.description.slice(0, 150)}...</p>
  {/* Only render the link if it's valid */}
  {job.job_link !== "No link available" ? (
    <a
      href={job.job_link}
      target="_blank"
      rel="noopener noreferrer"
      className="job-link"
    >
      🔗 Apply Here
    </a>
  ) : (
    <p>No application link available</p>
  )}
</div>
  ))}
</div>
        ) : <p>No jobs found.</p>
      )}
    </div>
  );
};

export default JobsPage;

