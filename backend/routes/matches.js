const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Tournament = require("../models/Tournament"); // References your actual model
const User = require("../models/User"); 
const transporter = require("../utils/mailer"); 

// 1. CONFIGURE MULTER FOR TOURNAMENT POSTER UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 2. CREATE A MATCH ROUTE (Auth protect bypassed for fast testing)
router.post("/create", upload.single("file"), async (req, res) => {
  try {
    // Extracted keys back out from the request body safely including entryFee
    const { title, sportType, location, date, time, maxPlayers, entryFee } = req.body;

    // Build public static file location path
    let fileLocationUrl = "default-sports.jpg";
    if (req.file) {
      fileLocationUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Initialize layout according to your Tournament collection fields
    const newTournament = new Tournament({
      title,
      sportType, 
      location, 
      date,
      time,
      maxPlayers: Number(maxPlayers),
      entryFee: Number(entryFee) || 0, // Successfully captured entry fee
      organizer: req.user?.id || "mock_admin", 
      image: fileLocationUrl 
    });

    const savedTournament = await newTournament.save();

    // 3. AUTOMATED EMAIL NOTIFICATION DISPATCH ENGINE
    try {
      const interestedUsers = await User.find({
        city: location,      
        interests: sportType     
      });

      if (interestedUsers.length > 0) {
        const emailList = interestedUsers.map(u => u.email).join(",");

        const mailOptions = {
          // FIXED: Pointing cleanly to your newly authenticated dedicated email address
          from: '"SportsConnect 🏆" <sportsconnectteamindia.app@gmail.com>', 
          to: emailList,
          subject: `New ${savedTournament.sportType} Match in ${savedTournament.location}!`,
          html: `
            <div style="font-family: sans-serif; border: 2px solid #0891b2; padding: 20px; border-radius: 15px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0891b2; text-transform: uppercase; font-style: italic;">Big News, Player! 🏀</h2>
              <p>A new <b>${savedTournament.sportType}</b> event has been posted: <span style="font-size: 16px; font-weight: bold; color: #334155;">${savedTournament.title}</span></p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p style="margin: 5px 0;"><b>📍 Where:</b> ${savedTournament.location}</p>
                <p style="margin: 5px 0;"><b>📅 Date:</b> ${savedTournament.date}</p>
                <p style="margin: 5px 0;"><b>⏰ When:</b> ${savedTournament.time}</p>
                <p style="margin: 5px 0;"><b>💰 Entry Fee:</b> ${savedTournament.entryFee > 0 ? `₹${savedTournament.entryFee}` : 'FREE'}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 13px; color: #64748b; text-align: center;">Open your dashboard now to join the tournament before spots fill up!</p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.log("Notification Email Engine Error:", error);
          else console.log("Notifications sent out successfully to:", emailList);
        });
      } else {
        console.log("No players found matching interests for this tournament area.");
      }
    } catch (emailQueryErr) {
      console.error("Non-fatal Email System Exception:", emailQueryErr.message);
    }

    return res.status(201).json(savedTournament);

  } catch (err) {
    console.error("Match Create Error Exception:", err);
    return res.status(400).json({ error: err.message });
  }
});

// GET ALL TOURNAMENTS
router.get("/all", async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.status(200).json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE A TOURNAMENT
router.delete("/:id", async (req, res) => {
  try {
    const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!deletedTournament) return res.status(404).json({ error: "Match not found" });
    res.status(200).json({ message: "Tournament removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;