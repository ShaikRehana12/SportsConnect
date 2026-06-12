const Match = require('../models/Match');
const User = require('../models/User');
const transporter = require('../utils/mailer'); // Import the Step B file

exports.createMatch = async (req, res) => {
  try {
    const { title, sport, location, date, time } = req.body;

    // 1. SAVE TOURNAMENT TO DATABASE
    const newMatch = await Match.create(req.body);

    // 2. FIND TARGETED USERS (The Step C Filter)
    // We look for users where:
    // a) Their 'interests' array includes the sport the admin just picked
    // b) Their 'city' matches the tournament location
    const targetedUsers = await User.find({
      interests: sport, 
      city: location
    });

    // 3. SEND EMAILS IN PARALLEL
    if (targetedUsers.length > 0) {
      const emailPromises = targetedUsers.map(user => {
        return transporter.sendMail({
          from: '"SportsConnect Admin" <your-email@gmail.com>',
          to: user.email,
          subject: `New ${sport} Match in ${location}! 🏆`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 20px; padding: 20px;">
              <h2 style="color: #0891b2; text-transform: uppercase;">Game On!</h2>
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>Based on your interest in <strong>${sport}</strong>, we thought you'd like to know about a new match nearby:</p>
              <div style="background: #f8fafc; padding: 15px; border-radius: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${title}</h3>
                <p>📍 <strong>Location:</strong> ${location}</p>
                <p>⏰ <strong>Time:</strong> ${date} at ${time}</p>
              </div>
              <a href="http://localhost:3000/feed" style="display: inline-block; background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold;">Join the Match</a>
              <p style="font-size: 10px; color: #94a3b8; margin-top: 30px;">You received this because you listed ${sport} as an interest in ${location}.</p>
            </div>
          `
        });
      });

      // Execute all emails
      await Promise.all(emailPromises);
      console.log(`Notifications sent to ${targetedUsers.length} users.`);
    }

    res.status(201).json({
      success: true,
      message: "Tournament published and interested users notified!",
      data: newMatch
    });

  } catch (error) {
    console.error("Step C Error:", error);
    res.status(500).json({ success: false, message: "Error in publication flow" });
  }
};