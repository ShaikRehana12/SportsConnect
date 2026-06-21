const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Tournament = require("../models/Tournament"); 
const User = require("../models/User"); 

// 👑 CONNECT TO YOUR VERIFIED HARDCODED TRANSPORTER
const transporter = require("../utils/mailer"); 

// CONFIGURE MULTER FOR TOURNAMENT POSTER UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// =========================================================================
// 🎟️ HELPER FUNCTION: ASYNC DIGITAL TICKET TRANSMISSION ENGINE
// =========================================================================
const sendTicketEmail = async (userEmail, userName, tournamentDetails) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 30px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <div style="background-color: #06b6d4; padding: 30px 20px; color: #ffffff;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; margin: 0 0 5px 0;">Official Arena Entry Pass</p>
            <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; font-style: italic; margin: 0;">SLOT LOCKED IN! 🎟️</h1>
          </div>

          <div style="padding: 30px; text-align: left;">
            <p style="font-size: 14px; color: #64748b; margin-top: 0;">Hey <b>${userName}</b>,</p>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">Your match registration pass has been verified on the roster. Your digital placement ticket is ready below:</p>
            
            <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 24px; padding: 20px; margin: 20px 0;">
              <p style="font-size: 9px; font-weight: 900; color: #06b6d4; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 0.1em;">Sports Connect Bracket Pass</p>
              <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; font-style: italic; color: #0f172a; margin: 0 0 15px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                ${tournamentDetails.title}
              </h2>
              
              <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
                <strong>📅 Date / Time:</strong> ${tournamentDetails.date} ${tournamentDetails.time ? `@ ${tournamentDetails.time}` : ''}
              </div>
              <div style="font-size: 12px; color: #475569; margin-bottom: 15px;">
                <strong>📍 Arena Location:</strong> ${tournamentDetails.location}
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 10px; font-weight: bold; color: #0f172a; text-transform: uppercase;">Roster ID: #${tournamentDetails._id.toString().substring(18)}</span>
                <span style="font-size: 9px; font-weight: 900; color: #059669; text-transform: uppercase; background-color: #ecfdf5; padding: 4px 8px; border-radius: 6px;">CONFIRMED ATTENDEE</span>
              </div>
            </div>

            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 25px; margin-bottom: 0;">Please display this email confirmation pass to coordinators at the arena venue desk.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"SportsConnect 🏆" <sportsconnectteamindia@gmail.com>',
      to: userEmail,
      subject: `🎟️ Roster Ticket Secured: ${tournamentDetails.title}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[MAIL SYSTEM] Pass ticket cleanly dispatched to client address: ${userEmail}`);
  } catch (error) {
    console.error("❌ Notification Pass Transmission Failure:", error.message);
  }
};

// =========================================================
// 1. FETCH ALL TOURNAMENTS WITH POPULATED PLAYER PROFILES
// =========================================================
router.get("/all", async (req, res) => {
  try {
    const tournaments = await Tournament.find({})
      .populate({
        path: "players",
        select: "name username email" 
      });
      
    res.status(200).json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================
// 2. CREATE A MATCH ROUTE (POST /api/matches/create)
// =========================================================
router.post("/create", upload.single("file"), async (req, res) => {
  try {
    const { title, sportType, location, date, time, maxPlayers, entryFee } = req.body;

    let fileLocationUrl = "default-sports.jpg";
    if (req.file) {
      fileLocationUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newTournament = new Tournament({
      title,
      sportType, 
      location, 
      date,
      time,
      maxPlayers: Number(maxPlayers),
      entryFee: Number(entryFee) || 0, 
      organizer: req.user?.id || "mock_admin", 
      image: fileLocationUrl,
      players: [] 
    });

    const savedTournament = await newTournament.save();

    // 🏆 UPDATED EMAIL ENGINE: BROADCAST PREMIUM CYAN DYNAMIC HTML ALERTS
    try {
      const sport = savedTournament.sportType ? savedTournament.sportType.trim() : "Sports";
      const cleanCity = location.includes(',') ? location.split(',').pop().trim() : location.trim();
      
      const sportRegex = new RegExp(`^${sport}$`, 'i');
      const cityRegex = new RegExp(`^${cleanCity}$`, 'i');

      const interestedUsers = await User.find({ 
        city: { $regex: cityRegex }, 
        interests: { $regex: sportRegex } 
      });

      if (interestedUsers.length > 0) {
        interestedUsers.forEach(user => {
          const displayUsername = user.username || 'Player';
          const userCity = user.city || cleanCity;

          transporter.sendMail({
            from: '"Sports Connect 🏆" <sportsconnectteamindia@gmail.com>', 
            to: user.email,
            subject: `New ${sport} Match Alert in ${cleanCity}! 🚀`,
            html: `
              <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f1f5f9; padding: 40px 10px; margin: 0; min-width: 100%;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border: 3px solid #06b6d4; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border-collapse: separate;">
                  <tr>
                    <td align="center" style="background-color: #06b6d4; padding: 35px 20px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 5px;">🏆</div>
                      <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; color: #ffffff;">New Event Dynamic Alert!</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 35px 30px; background-color: #ffffff;">
                      <p style="font-size: 15px; color: #334155; margin-top: 0; margin-bottom: 12px;">Hey <b>${displayUsername}</b>,</p>
                      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
                        A brand new <strong>${sport}</strong> event has been posted in your city! Check out the details below and reserve your slot before brackets fill up:
                      </p>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-left: 4px solid #06b6d4; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <tr>
                          <td>
                            <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 15px 0; text-transform: capitalize;">${savedTournament.title}</h3>
                            <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">📍</span><strong>Venue Location:</strong> ${savedTournament.location}</p>
                            <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">📅</span><strong>Scheduled Date:</strong> ${savedTournament.date}</p>
                            <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">⏰</span><strong>Timing Slot:</strong> ${savedTournament.time || 'N/A'}</p>
                            <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">👥</span><strong>Player Cap Limit:</strong> Max ${savedTournament.maxPlayers} Players</p>
                            <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">💰</span><strong>Entry Fee:</strong> <span style="color: #06b6d4; font-weight: bold;">${savedTournament.entryFee === 0 ? 'FREE' : '₹' + savedTournament.entryFee}</span></p>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="http://localhost:3000/feed" style="display: inline-block; background-color: #06b6d4; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">View & Register Now</a>
                          </td>
                        </tr>
                      </table>
                      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
                      <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0; line-height: 1.5;">
                        You received this automated notification because you listed "${sport}" inside your SportsConnect profile preferences for ${userCity}.
                      </p>
                      <p style="font-size: 12px; font-weight: bold; color: #06b6d4; text-align: center; margin: 8px 0 0 0;">
                        SportsConnect Team India
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            `
          });
        });
      }
    } catch (e) { 
      console.error("Notification alert failure:", e); 
    }

    return res.status(201).json(savedTournament);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// =========================================================
// 3. REGISTER USER FOR A SLOT WITH AUTOMATIC EMAIL TICKETING
// =========================================================
router.post("/:id/register", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`[REGISTER] Target Tournament ID: ${req.params.id}, User ID: ${userId}`);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament record not found." });
    }

    if (!tournament.players) {
      tournament.players = [];
    }

    const isAlreadyRegistered = tournament.players.some(p => p.toString() === userId.toString());
    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "You have already secured a slot for this match!" });
    }

    const limit = tournament.maxPlayers || 10;
    if (tournament.players.length >= limit) {
      return res.status(400).json({ message: "This match is already fully booked!" });
    }

    tournament.players.push(userId);
    await tournament.save();

    // DYNAMIC EXTRACTION ENGINE FOR THE EMAIL MODULE
    try {
      let userProfile = null;
      if (userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
        userProfile = await User.findById(userId);
      }
      
      if (!userProfile) {
        userProfile = await User.findOne({ 
          $or: [
            { username: userId },
            { name: userId }
          ]
        });
      }

      if (userProfile && userProfile.email) {
        sendTicketEmail(userProfile.email, userProfile.username || userProfile.name || "Competitor", tournament);
      } else {
        console.log(`⚠️ [MAIL SYSTEM] User profile or email address missing for token: ${userId}`);
      }
    } catch (mailErr) {
      console.error("Background ticket routing module failed safely:", mailErr.message);
    }

    console.log(`[REGISTER SUCCESS] Total players now: ${tournament.players.length}`);
    res.status(200).json({ success: true, data: tournament });
  } catch (err) {
    console.error("Registration endpoint crash:", err);
    res.status(500).json({ message: "Internal server registration failure.", error: err.message });
  }
});

// =========================================================
// 4. CANCEL REGISTRATION / LEAVE PATHWAY (POST /api/matches/:id/cancel)
// =========================================================
const handleCancellationLogic = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`[CANCEL] Target Tournament ID: ${req.params.id}, User ID: ${userId}`);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament record not found." });
    }

    if (!tournament.players) {
      tournament.players = [];
    }

    tournament.players = tournament.players.filter(player => player.toString() !== userId.toString());
    await tournament.save();

    console.log(`[CANCEL SUCCESS] Total players left: ${tournament.players.length}`);
    res.status(200).json({ success: true, data: tournament });
  } catch (err) {
    console.error("Cancellation endpoint crash:", err);
    res.status(500).json({ message: "Internal server cancellation failure.", error: err.message });
  }
};

// Map both pathways to execute the exact same cancellation function
router.post("/:id/cancel", handleCancellationLogic);
router.post("/:id/unregister", handleCancellationLogic);

// ==========================================
// 5. DELETE TOURNAMENT
// ==========================================
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