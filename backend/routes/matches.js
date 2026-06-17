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
      // Find users whose city matches the event location AND their interests array contains the sport
      const interestedUsers = await User.find({
        city: location,      
        interests: sportType     
      });

      if (interestedUsers.length > 0) {
        const emailList = interestedUsers.map(u => u.email).join(",");
        console.log(`🎯 Found ${interestedUsers.length} players interested in ${sportType} in ${location}. Sending alerts...`);

        const mailOptions = {
          // Pointing cleanly to your newly authenticated dedicated email address
          from: '"SportsConnect 🏆" <sportsconnectteamindia.app@gmail.com>', 
          to: emailList,
          subject: `New ${savedTournament.sportType} Match Alert in ${savedTournament.location}! 🚀`,
          html: `
            <div style="font-family: sans-serif; border: 2px solid #06b6d4; padding: 25px; border-radius: 15px; max-width: 550px; margin: 0 auto; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 40px;">🏆</span>
                <h2 style="color: #06b6d4; margin: 5px 0; text-transform: uppercase; letter-spacing: 1px;">New Event Dynamic Alert!</h2>
              </div>
              
              <p style="color: #334155; font-size: 16px; line-height: 1.5;">Hey Player,</p>
              <p style="color: #334155; font-size: 15px; line-height: 1.5;">A brand new <b>${savedTournament.sportType}</b> event has been posted in your city! Check out the details below and reserve your slot before brackets fill up:</p>
              
              ${savedTournament.image && savedTournament.image !== 'default-sports.jpg' ? `
              <div style="text-align: center; margin: 15px 0;">
                <img src="${savedTournament.image}" alt="Event Banner" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; max-height: 250px; object-fit: cover;" />
              </div>
              ` : ''}

              <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">${savedTournament.title}</h3>
                <p style="margin: 6px 0; color: #475569;">📍 <b>Venue Location:</b> ${savedTournament.location}</p>
                <p style="margin: 6px 0; color: #475569;">📅 <b>Scheduled Date:</b> ${savedTournament.date}</p>
                <p style="margin: 6px 0; color: #475569;">⏰ <b>Timing Slot:</b> ${savedTournament.time || "TBD"}</p>
                <p style="margin: 6px 0; color: #475569;">👥 <b>Player Cap Limit:</b> Max ${savedTournament.maxPlayers || "Unlimited"} Players</p>
                <p style="margin: 6px 0; color: #475569;">💰 <b>Entry Fee:</b> <span style="color: #0891b2; font-weight: bold;">${savedTournament.entryFee > 0 ? `₹${savedTournament.entryFee}` : 'FREE'}</span></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/dashboard" 
                   style="background-color: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);">
                    View & Register Now
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #64748b; font-size: 11px; text-align: center; margin: 0;">You received this automated notification because you listed "${savedTournament.sportType}" inside your SportsConnect profile preferences for ${savedTournament.location}.</p>
              <p style="color: #06b6d4; font-size: 13px; font-weight: bold; text-align: center; margin-top: 10px;">SportsConnect Team India</p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.log("❌ Notification Email Engine Error:", error);
          else console.log("✅ Notifications sent out successfully to:", emailList);
        });
      } else {
        console.log(`ℹ️ Tournament created, but no registered users match the target filters (${sportType} in ${location}).`);
      }
    } catch (emailQueryErr) {
      console.error("⚠️ Background notification automated query crashed:", emailQueryErr.message);
    }

    return res.status(201).json(savedTournament);

  } catch (err) {
    console.error("Match Create Error Exception:", err);
    return res.status(400).json({ error: err.message });
  }
});

// 4. REGISTER USER FOR A TOURNAMENT (FOOLPROOF ENFORCEMENT ENGINE)
// 5. LEAVE A TOURNAMENT / CANCEL SLOT
// Add a dynamic cancel/leave endpoint to handle registry updates
router.post('/leave/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Tournament record not found." });

    // Enforce deadline validation rule: Cancel allowed only up until the event date
    const today = new Date().setHours(0,0,0,0);
    const eventDate = new Date(match.date).setHours(0,0,0,0);
    if (today > eventDate) {
      return res.status(400).json({ message: "Cannot cancel slots for past or active match-day events." });
    }

    const { userId } = req.body; // or extracted cleanly via your verifyToken middleware
    
    // Pull user out of the backend schema array
    match.players = match.players.filter(player => player.toString() !== userId);
    await match.save();

    // Populate updated document data structures back to frontend
    const updatedMatch = await Match.findById(req.params.id).populate('players', 'name');
    res.status(200).json(updatedMatch);
  } catch (err) {
    res.status(500).json({ message: "Internal update failure.", error: err.message });
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