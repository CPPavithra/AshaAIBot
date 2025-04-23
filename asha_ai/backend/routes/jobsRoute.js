const axios = require('axios');
const express = require('express');
const router = express.Router();

// Function to get job search results from the Flask API
async function searchJobs(userQuery, userLocation) {
  try {
    // Send GET request to Flask API with user inputs
    const response = await axios.get('https://ashaaibot-python.onrender.com/search_jobs', {
      params: {
        query: userQuery,
        location: userLocation
      }
    });

    // Return the job results
    const jobResults = response.data;

    return jobResults;
  } catch (error) {
    console.error('Error fetching job data:', error.message);
    throw error;  // Propagate the error so it can be handled by the route
  }
}

// Endpoint to search for jobs (This will handle incoming requests from the frontend or client)
router.get('/search_jobs', async (req, res) => {
  const { query, location } = req.query;

  // Check if both query and location are provided
  if (!query || !location) {
    return res.status(400).json({ error: "Missing required parameters: query or location" });
  }

  try {
    // Call the function to fetch job results
    const jobResults = await searchJobs(query, location);

    // Return the job search results as a JSON response
    res.json(jobResults);
  } catch (error) {
    // Return error response if something goes wrong
    res.status(500).json({ error: 'Internal server error while fetching job data.' });
  }
});

module.exports = router;

