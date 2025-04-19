require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const jobsRoute = require('./routes/jobsRoute');
const { smartResponse, geminiFallback } = require("./ai/smartresponse");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true })); //for password parsing
const fs = require('fs');
const xlsx = require("xlsx");
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create or fetch session ID
async function getOrCreateChatSession(email) {
  const [rows] = await db.query("SELECT id FROM chat_sessions WHERE user_email = ? ORDER BY created_at DESC LIMIT 1", [email]);
  if (rows.length > 0) return rows[0].id;

  const [insertResult] = await db.query("INSERT INTO chat_sessions (user_email) VALUES (?)", [email]);
  return insertResult.insertId;
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 🚀 Signup Route
app.post('/signup', upload.fields([
  { name: 'profile_pic', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name, age, gender, phone,
      experience, skillset, email, password, recheck_password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = req.files['profile_pic']?.[0]?.filename || null;
    const resume = req.files['resume']?.[0]?.filename || null;

    await db.execute(
      `INSERT INTO users (name, age, gender, phone, experience, skillset, profile_pic, resume, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, age, gender, phone, experience, skillset, profilePic, resume, email, hashedPassword]
    );

    res.json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});


app.post('/login', async (req, res) => {
  try {
    console.log('Login request received');
    console.log('Request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    console.log('User found:', user.email);
    console.log('Entered password:', JSON.stringify(password));
    console.log('Stored hashed password:', user.password);

    const match = await bcrypt.compare(password, user.password);

    console.log('Password match result:', match);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // You should generate and send a token here for authentication in future requests
    res.json({ message: 'Login successful', user });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get("/user", async (req, res) => {
  const { email } = req.query;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ ADD THIS PUT ROUTE FOR UPDATING USER DATA
app.put("/user", async (req, res) => {
  const { email } = req.query;
  const updatedUserData = req.body;

  try {
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required for updating." });
    }

    // Check if there's any data to update
    if (Object.keys(updatedUserData).length === 0) {
      return res.status(400).json({ error: "No update data provided." });
    }

    // Construct the update query dynamically
    const updateFields = [];
    const updateValues = [];

    for (const key in updatedUserData) {
      if (updatedUserData.hasOwnProperty(key) && key !== 'email' && key !== 'password') { // Prevent updating email and password here for simplicity, handle separately if needed
        updateFields.push(`${key} = ?`);
        updateValues.push(updatedUserData[key]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(200).json({ message: "No fields to update." });
    }

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE email = ?`;
    const values = [...updateValues, email];

    const [result] = await db.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ message: "Profile updated successfully!" });
    } else {
      res.status(404).json({ error: "User not found or no changes applied." });
    }

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});
app.post("/ai-response-old", async (req, res) => {
  const { message: userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const result = await smartResponse(userInput);
    return res.json(result);
  } catch (err) {
    const fallback = await geminiFallback(userInput);
    return res.json({ source: "Gemini", response: `Response:\n${fallback}` });
  }
});

// File paths (adjust according to your file location)

const diversityFilePath = path.join(__dirname, 'diversityinclusion.xlsx');

const readXlsxFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
};

app.get('/filters', (req, res) => {
  try {
    const data = readXlsxFile(diversityFilePath);
    const regions = [...new Set(data.map(item => item['Region group: nationality 1']))];
    const jobLevels = [...new Set(data.map(item => item['Job Level after FY20 promotions']))];
    const nationalities = [...new Set(data.map(item => item['Nationality 1']))];
    res.json({ regions, jobLevels, nationalities });
  } catch (error) {
    console.error("Error reading filters data:", error);
    res.status(500).json({ error: 'Failed to fetch filter data' });
  }
});


// Diversity score endpoint
app.get('/diversity-score', (req, res) => {
  const { region, jobLevel, nationality } = req.query;
  
  if (!region || !jobLevel || !nationality) {
    return res.status(400).json({
      error: 'Missing required filter parameters: region, jobLevel, nationality',
      details: { region, jobLevel, nationality }
    });
  }
  
  try {
    const data = readXlsxFile(diversityFilePath);
    const filteredData = data.filter(item =>
      item['Region group: nationality 1'] === region &&
      item['Job Level after FY20 promotions'] === jobLevel &&
      item['Nationality 1'] === nationality
    );
    
    // Calculate age groups distribution
    const ageGroupDistribution = filteredData.reduce((acc, item) => {
      const ageGroup = item['Age group'];
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate gender distribution
    const genderDistribution = filteredData.reduce((acc, item) => {
      const gender = item['Gender'];
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate total employees
    const totalEmployees = filteredData.length;
    
    // Calculate gender diversity (ratio of non-dominant gender)
    let genderDiversity = 0;
    if (totalEmployees > 0) {
      const genderCounts = Object.values(genderDistribution);
      const maxGenderCount = Math.max(...genderCounts);
      genderDiversity = ((totalEmployees - maxGenderCount) / totalEmployees).toFixed(2);
    }
    
    // Calculate nationality diversity
    const uniqueNationalities = new Set(filteredData.map(item => item['Nationality 1'])).size;
    const nationalityDiversity = uniqueNationalities > 1 ? 
      (uniqueNationalities / totalEmployees).toFixed(2) : "0.00";
    
    const diversityScore = {
      ageGroupDistribution,
      genderDistribution,
      totalEmployees,
      genderDiversity,
      nationalityDiversity
    };
    
    res.json(diversityScore);
  } catch (error) {
    console.error("Error reading diversity score data:", error);
    res.status(500).json({ error: 'Failed to fetch diversity score data' });
  }
});
app.post('/diversity-suggestions', (req, res) => {
  const { job_level, nationality } = req.body;

  if (!job_level || !nationality) {
    return res.status(400).json({ error: 'Job level and nationality are required' });
  }

  try {
    const data = readXlsxFile(diversityFilePath);
    const suggestions = data.filter(item =>
      item['Job Level after FY20 promotions'] === job_level &&
      item['Nationality 1'] === nationality
    ).map(item => ({
      suggestion: `Consider increasing diversity for ${item['Job Level after FY20 promotions']} in the ${item['Region group: nationality 1']} region, particularly for the nationality ${nationality}.`
    }));

    res.json({ suggestions });
  } catch (error) {
    console.error("Error reading suggestions data:", error);
    res.status(500).json({ error: 'Failed to fetch diversity suggestions' });
  }
});


//FOR USER CHATS AND USER HISTORY

app.post("/chat", async (req, res) => {
  const { email, message, chatId } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  try {
    // Get user ID
    const [userRows] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (userRows.length === 0) return res.status(404).json({ error: "User not found." });

    const userId = userRows[0].id;
    let sessionId = chatId;

    // If no chatId, create a new chat session
    if (!sessionId) {
      const [result] = await db.execute("INSERT INTO chat_sessions (user_id) VALUES (?)", [userId]);
      sessionId = result.insertId;
    }

    // Store user message
    await db.execute(
      "INSERT INTO user_memory (user_id, session_id, message, is_user) VALUES (?, ?, ?, ?)",
      [userId, sessionId, message, true]
    );

    // Generate AI response
    let response;
    try {
      response = await smartResponse(message);
    } catch (err) {
      response = await geminiFallback(message);
    }

    const aiReply = response.response || response;

    // Store AI reply
    await db.execute(
      "INSERT INTO user_memory (user_id, session_id, message, is_user) VALUES (?, ?, ?, ?)",
      [userId, sessionId, aiReply, false]
    );

    res.json({ user: message, ai: aiReply, chatId: sessionId });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed." });
  }
});


app.get("/chat-history", async (req, res) => {
  const email = req.query.email;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    // Query to get chat messages from the database
    const [messages] = await db.query(
      "SELECT message, is_user FROM user_memory WHERE user_email = ? ORDER BY timestamp ASC",
      [email]
    );

    // Log the fetched messages for debugging
    console.log('Fetched messages:', messages);

    // Check if we received an empty array or invalid data
    if (!Array.isArray(messages)) {
      return res.status(500).json({ error: "Invalid data format" });
    }

    // Send the messages back in the response
    res.json(messages);
  } catch (error) {
    // Log any database errors
    console.error('History Error:', error);
    res.status(500).json({ error: "Error retrieving history" });
  }
});

app.get("/chat/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const [messages] = await db.execute(
      "SELECT message, is_user, timestamp FROM user_memory WHERE session_id = ? ORDER BY timestamp ASC",
      [chatId]
    );

    res.json({ chatId, messages });

  } catch (err) {
    console.error("Fetch chat by ID error:", err);
    res.status(500).json({ error: "Failed to fetch chat." });
  }
});


app.post("/ai-response", async (req, res) => {
  const { message: userInput, email } = req.body;

  if (!email || !userInput) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  try {
    const sessionId = await getOrCreateChatSession(email);

    // Save user input to DB
    await db.query(
      "INSERT INTO user_memory (user_email, message, is_user, session_id) VALUES (?, ?, 1, ?)",
      [email, userInput, sessionId]
    );

    // 👇 Fetch past messages for personalized prompting (limit to last N)
    const [rows] = await db.query(
      "SELECT message, is_user FROM user_memory WHERE user_email = ? AND session_id = ? ORDER BY id DESC LIMIT 10",
      [email, sessionId]
    );

    // 👇 Build prompt with context
    const historyPrompt = rows
      .reverse()
      .map(row => (row.is_user ? `User: ${row.message}` : `AI: ${row.message}`))
      .join("\n");

    const fullPrompt = `${historyPrompt}\nUser: ${userInput}\nAI:`;

    // Try smartResponse with context
    let aiResponse;
    try {
      aiResponse = await smartResponse(fullPrompt);
    } catch (err) {
      console.warn("smartResponse failed:", err);
    }

    // Fallback if needed
    if (!aiResponse) {
      aiResponse = await geminiFallback(fullPrompt);
    }

    // Save AI response
    await db.query(
      "INSERT INTO user_memory (user_email, message, is_user, session_id) VALUES (?, ?, 0, ?)",
      [email, aiResponse, sessionId]
    );

    return res.json({ source: "Gemini", response: aiResponse });
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

//JOBS 
app.use('/api', jobsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
