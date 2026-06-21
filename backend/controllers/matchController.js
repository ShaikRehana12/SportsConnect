const Match = require('../models/Match');
const User = require('../models/User');
const transporter = require('../utils/mailer'); 
const sendTicketEmail = require('../utils/sendTicketEmail'); 

// ==========================================
// 1. CREATE MATCH & NOTIFY INTERESTED USERS
// ==========================================
exports.createMatch = async (req, res) => {
  try {
    console.log("==================== AUTOMATED EVENT MATCHING ====================");
    
    // Save tournament to database using your exact MatchSchema fields
    const newMatch = await Match.create(req.body);
    console.log(`🎰 Match Created Successfully ID: ${newMatch._id}`);

    // Standardize fields with strict backups so variables can never be undefined
    const sport = newMatch.sport ? newMatch.sport.trim() : "Sports";
    const location = newMatch.location ? newMatch.location.trim() : "Hyderabad";
    const date = newMatch.date || "2026-06-30";
    const time = newMatch.time || "17:00";
    const maxPlayers = newMatch.maxPlayers || 10;
    const matchTitle = req.body.title || `${sport}-Championship`;

    // Create safe case-insensitive regex selectors
    const sportRegex = new RegExp(`^${sport}$`, 'i');
    const cleanCity = location.includes(',') ? location.split(',').pop().trim() : location.trim();
    const cityRegex = new RegExp(`^${cleanCity}$`, 'i'); 

    console.log(`🔍 Scanning DB for players interested in [${sport}] living in [${cleanCity}]...`);

    // Find all users whose interests array contains the sport name and live in the city
    const targetedUsers = await User.find({
      interests: { $regex: sportRegex }, 
      city: { $regex: cityRegex } 
    });

    console.log(`📢 Automation found ${targetedUsers.length} matching user profiles.`);

    if (targetedUsers.length > 0) {
      const emailPromises = targetedUsers.map(user => {
        const displayUsername = user.username || 'Player';
        const userCity = user.city || cleanCity;

        // 🌟 FORCE HTML STRUCTURE ONLY - NO PLAIN TEXT FALLBACK PROPERTY
        return transporter.sendMail({
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
                          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 15px 0; text-transform: capitalize;">${matchTitle}</h3>
                          <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">📍</span><strong>Venue Location:</strong> ${location}</p>
                          <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">📅</span><strong>Scheduled Date:</strong> ${date}</p>
                          <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">⏰</span><strong>Timing Slot:</strong> ${time}</p>
                          <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">👥</span><strong>Player Cap Limit:</strong> Max ${maxPlayers} Players</p>
                          <p style="font-size: 13px; color: #334155; margin: 8px 0;"><span style="margin-right: 6px;">💰</span><strong>Entry Fee:</strong> <span style="color: #06b6d4; font-weight: bold;">FREE</span></p>
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
      await Promise.all(emailPromises);
      console.log("✅ Beautiful HTML alerts broadcast successfully!");
    }

    res.status(201).json({ success: true, data: newMatch });
  } catch (error) {
    console.error("❌ Error in createMatch:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 2. REGISTER A USER & DISPATCH DIGITAL TICKET
// ==========================================
exports.registerMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const { userId } = req.body; 

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID / Username is required" });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    // 🔍 RESOLVE USER PROFILE USING EITHER USERNAME OR OBJECT ID
    let playerProfile = null;
    if (userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
      playerProfile = await User.findById(userId);
    }
    if (!playerProfile) {
      playerProfile = await User.findOne({ username: { $regex: new RegExp(`^${userId.trim()}$`, 'i') } });
    }

    if (!playerProfile) {
      return res.status(444).json({ success: false, message: "Profile does not exist inside our collection." });
    }

    // 🔍 PREVENT DUPLICATE SLOT BOOKINGS
    const isAlreadyRegistered = match.players.some(p => p && p.toString() === playerProfile._id.toString());
    if (isAlreadyRegistered) {
      return res.status(400).json({ success: false, message: "You have already secured a slot!" });
    }

    // 🔍 PUSH VALID OBJECT ID TO PLAYERS ARRAY
    match.players.push(playerProfile._id);
    if (match.players.length >= match.maxPlayers) {
      match.status = 'full';
    }
    await match.save();

    console.log(`🎟️ Slot Locked! Forwarding ticket pass layout to: ${playerProfile.email}`);
    
    // Dispatch ticket email pass directly
    await sendTicketEmail(playerProfile.email, playerProfile.username, match);

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    console.error("❌ Registration Pipeline Crash:", error.message);
    res.status(500).json({ success: false, error: "Internal Registration Failure: " + error.message });
  }
};

// ==========================================
// 3. CANCEL REGISTRATION TICKET
// ==========================================
exports.cancelRegistration = async (req, res) => {
  try {
    const matchId = req.params.id;
    const { userId } = req.body;

    let targetId = userId;
    if (!userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const userDoc = await User.findOne({ username: { $regex: new RegExp(`^${userId.trim()}$`, 'i') } });
      if (userDoc) targetId = userDoc._id;
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { $pull: { players: targetId } },
      { new: true }
    );

    if (updatedMatch && updatedMatch.players.length < updatedMatch.maxPlayers) {
      updatedMatch.status = 'open';
      await updatedMatch.save();
    }

    res.status(200).json({ success: true, data: updatedMatch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};