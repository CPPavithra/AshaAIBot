require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true })); //for password parsing

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
