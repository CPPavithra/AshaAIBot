// routes/matchjob.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../server'); // Update path if needed

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyD9iuKEeITxpZQZLfHFUqiLbZwGAh5mmNg'; // Replace this

const createPrompt = (skillset, experience) => `
I have ${experience} years of experience and the following skills: ${skillset}.
Suggest:
1. Top 5 job roles I should apply for.
2. Companies hiring for these roles.
3. Freelancing or alternative paths.
4. Recommended next skills.
Respond in JSON format like this:
{
  "jobs": [{ "role": "Frontend Developer", "companies": ["Google", "Meta"] }],
  "freelance": ["Build websites for small businesses"],
  "next_skills": ["TypeScript", "Next.js"]
}
`;

router.post('/matchjob', async (req, res) => {
  try {
    const { email } = req.body;

    const [userRows] = await db.execute('SELECT experience, skillset FROM users WHERE email = ?', [email]);
    console.log('User Rows:', userRows);
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const { experience, skillset } = userRows[0];
    const prompt = createPrompt(skillset, experience);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(result);

    res.json({ recommendations: parsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to match job' });
  }
});

module.exports = router;

