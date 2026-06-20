const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware (MUST be at the very top before any routes)
app.use(cors()); 
app.use(express.json()); 

// 2. Import Routes
const authRoutes = require('./routes/auth');
const matchRoutes = require("./routes/matches");
const tournamentRoutes = require('./routes/tournamentRoutes');

// 3. Use Routes (Assign prefixes clearly)
app.use('/api/auth', authRoutes);       // Handles Login, Register, Forgot Password
app.use('/api/matches', matchRoutes);    // Handles Match creation and feed
app.use('/api/tournaments', tournamentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 4. Database Connection
const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Database Connected to SportsConnect"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 5. Base Route (Test if backend is alive)
app.get('/', (req, res) => {
    res.send("SportsConnect Backend is running!");
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});