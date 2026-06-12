const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/mailer');

// --- REGISTER ---
router.post('/register', async (req, res) => {
    try {
        const { email, password, interests, city, username, role } = req.body;

        // 1. Check if user already exists (Normalize email to lowercase)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json("Email already registered!");

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user
        const newUser = new User({
            username: username || email.split('@')[0], 
            email: email.toLowerCase(),
            password: hashedPassword,
            city: city || "Hyderabad",
            interests: interests || [],
            role: role || 'user'
        });

        const user = await newUser.save();
        res.status(201).json({ message: "Registration Successful!", user });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json("Backend error during registration");
    }
});
// backend/routes/auth.js

// UPDATE PASSWORD ROUTE
router.post('/update-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        // 1. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 2. Find user by ID and update their password
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json("User not found");

        res.status(200).json("Password updated successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error during password update");
    }
});

// --- FORGOT PASSWORD ---
router.post('/forgot-password', async (req, res) => {
    try {
        // Normalize the incoming email to match the DB
        const email = req.body.email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json("User not found");
        }

        const mailOptions = {
            from: '"SportsConnect 🏆" <rehanask1205@gmail.com>',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #0891b2;">SportsConnect</h2>
                    <p>Hello <strong>${user.username}</strong>,</p>
                    <p>You requested a password reset. Click the button below to update your password:</p>
                    <a href="http://localhost:3000/reset-password/${user._id}" 
                       style="background-color: #0891b2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                       Reset Password
                    </a>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error("Mail Error:", err);
                return res.status(500).json("Email failed to send");
            }
            res.status(200).json("Email sent!");
        });
    } catch (err) {
        console.error("Forgot Password Logic Error:", err);
        res.status(500).json("Internal Server Error");
    }
});
// backend/routes/auth.js

// Ensure this is router.post (NOT router.get)
router.post('/update-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json("User not found");

        res.status(200).json("Password updated successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error");
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (!user) return res.status(401).json("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json("Wrong password!");

        // Create Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            "yourSecretKey", 
            { expiresIn: "1h" }
        );

        // Send detailed user data to frontend for localStorage
        res.status(200).json({
            token,
            username: user.username,
            role: user.role,
            city: user.city || "Hyderabad",
            interests: user.interests || []
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json("Internal Server Error");
    }
});

module.exports = router;