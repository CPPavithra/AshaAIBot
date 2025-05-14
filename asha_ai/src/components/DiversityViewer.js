// frontend (React)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';
import './DiversityViewer.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DiversityViewer() {
  const [filters, setFilters] = useState({ regions: [], jobLevels: [], nationalities: [] });
  const [selected, setSelected] = useState({ region: '', jobLevel: '', nationality: '' });
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios.get('https://ashaaibot-server.onrender.com/filters').then(res => setFilters(res.data));
  }, []);

  useEffect(() => {
    if (selected.region && selected.jobLevel && selected.nationality) {
      axios.get('https://ashaaibot-server.onrender.com/diversity-score', { params: selected })
        .then(res => {
          if (res.data) {
            setScore(res.data);
          } else {
            setScore(null);
          }
        })
        .catch(error => {
          console.error("Error fetching diversity score:", error);
          setScore(null);
        });
    } else {
      setScore(null);
    }
  }, [selected]);

  const handleChange = (e) => {
    setSelected(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchSuggestions = async () => {
    if (!selected.jobLevel || !selected.nationality) {
      alert("Please select both job level and nationality");
      return;
    }

    try {
      const res = await axios.post('https://ashaaibot-server.onrender.com/diversity-suggestions', {
        job_level: selected.jobLevel,
        nationality: selected.nationality
      });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
      setSuggestions([]);
    }
  };

  const ageChart = score && {
    labels: Object.keys(score.ageGroupDistribution || {}),
    datasets: [{
      label: 'Employees by Age Group',
      data: Object.values(score.ageGroupDistribution || {}),
      backgroundColor: '#4f46e5',
    }]
  };

  return (
  <div className="container">
    <h2 className="page-title">🌍 Diversity Score Viewer</h2>

    <div className="filter-controls">
      <select name="region" onChange={handleChange} value={selected.region}>
        <option value="">Select Region</option>
        {filters.regions.map(r => <option key={r}>{r}</option>)}
      </select>

      <select name="jobLevel" onChange={handleChange} value={selected.jobLevel}>
        <option value="">Select Job Level</option>
        {filters.jobLevels.map(j => <option key={j}>{j}</option>)}
      </select>

      <select name="nationality" onChange={handleChange} value={selected.nationality}>
        <option value="">Select Nationality</option>
        {filters.nationalities.map(n => <option key={n}>{n}</option>)}
      </select>
    </div>

    {score && (
      <div className="results">
        <div className="metrics">
          <div className="metric">
            <p>Gender Diversity</p>
            <strong>{score.genderDiversity}</strong>
          </div>
          <div className="metric">
            <p>Total Employees</p>
            <strong>{score.totalEmployees}</strong>
          </div>
          <div className="metric">
            <p>Nationality Diversity</p>
            <strong>{score.nationalityDiversity}</strong>
          </div>
        </div>

        <div className="chart-container">
          <Bar data={ageChart} />
        </div>
      </div>
    )}

    <div className="suggestions">
      <button onClick={fetchSuggestions}>
        Get Diversity Suggestions
      </button>

      {suggestions.length > 0 && (
        <div>
          <h3>Diversity Suggestions:</h3>
          <ul>
            {suggestions.map((s, index) => (
              <li key={index}>{s.suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

      </div>
);}
