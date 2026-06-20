const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/mailer');

const JWT_SECRET = "yourSecretKey"; 

// =========================================================
// 1. USER REGISTER ENDPOINT
// =========================================================
router.post('/register', async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json("Email and Password are required fields.");
        }

        const { email, password, interests, city, username, role } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) return res.status(400).json("Email already registered!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username || email.split('@')[0], 
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            city: city || "Hyderabad",
            interests: interests || [],
            role: role || 'user',
            isVerified: false 
        });

        const user = await newUser.save();

        try {
            // 👑 FIX 1: Increase expiration from 2 hours to 24 hours so it doesn't expire while testing
            const verificationToken = jwt.sign(
                { userId: user._id },
                JWT_SECRET,
                { expiresIn: "24h" } 
            );

            const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

            const mailOptions = {
                from: '"SportsConnect 🏆" <sportsconnectteamindia.app@gmail.com>',
                to: user.email,
                subject: "Welcome to SportsConnect! Verify Your Account 🚀",
                html: `
                    <div style="font-family: sans-serif; border: 2px solid #06b6d4; padding: 25px; border-radius: 15px; max-width: 550px; margin: 0 auto; background-color: #ffffff;">
                        <h2 style="color: #06b6d4; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Welcome to the Team!</h2>
                        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hi <strong>${user.username}</strong>,</p>
                        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Thank you for registering with SportsConnect. Click the button below to instantly verify your email address and activate your match-making profile dashboard:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);">
                                Verify Account
                            </a>
                        </div>
                        
                        <p style="color: #64748b; font-size: 12px; text-align: center;">This link remains secure and active for the next 24 hours.</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="color: #06b6d4; font-size: 13px; font-weight: bold; text-align: center; margin: 0;">SportsConnect Team India</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) console.error("⚠️ Silent Registration Email Dispatch Warning:", err.message);
                else console.log(`🚀 Initial verification link dispatched dynamically to: ${user.email}`);
            });

        } catch (emailBuildErr) {
            console.error("Non-fatal onboarding email structural exception:", emailBuildErr.message);
        }

        return res.status(201).json({ message: "Registration Successful! Verification email sent.", user });
    } catch (err) {
        console.error("Register Error:", err);
        return res.status(500).json("Backend error during registration");
    }
});

// =========================================================
// 2. RESEND VERIFICATION LINK ENDPOINT
// =========================================================
router.post("/resend-verification", async (req, res) => {
    try {
        if (!req.body || !req.body.email) {
            return res.status(400).json("Email address is required.");
        }

        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json("No account found with this email address.");
        }

        if (user.isVerified) {
            return res.status(400).json("This account is already verified. Please log in.");
        }

        // 👑 FIX 2: Increase token expiration here as well to 24 hours
        const verificationToken = jwt.sign(
            { userId: user._id },
            JWT_SECRET, 
            { expiresIn: "24h" }
        );

        const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: '"SportsConnect 🏆" <sportsconnectteamindia.app@gmail.com>',
            to: user.email,
            subject: "Verify Your SportsConnect Account 🚀",
            html: `
                <div style="font-family: sans-serif; border: 2px solid #06b6d4; padding: 25px; border-radius: 15px; max-width: 550px; margin: 0 auto; background-color: #ffffff;">
                    <h2 style="color: #06b6d4; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Verify Your Email</h2>
                    <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hi <strong>${user.username}</strong>,</p>
                    <p style="color: #334155; font-size: 15px; line-height: 1.5;">You requested a new verification link for your SportsConnect account. Click the button below to activate your account and join local tournaments:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);">
                            Verify Account
                        </a>
                    </div>
                    
                    <p style="color: #64748b; font-size: 12px; text-align: center;">This link is valid for 24 hours.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="color: #06b6d4; font-size: 13px; font-weight: bold; text-align: center; margin: 0;">SportsConnect Team India</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error("Resend Mail Error:", err);
                return res.status(500).json("Email failed to send");
            }
            return res.status(200).json("Verification email sent!");
        });
    } catch (err) {
        console.error("Resend Verification Logic Error:", err);
        return res.status(500).json("Internal Server Error");
    }
});

// =========================================================
// 3. QUERY-BASED EMAIL VERIFICATION ENDPOINT
// =========================================================
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query; 

        if (!token) {
            return res.status(400).json({ message: "Verification token parameter is missing." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (jwtErr) {
            // 👑 FIX 3: Clean up the error response format so your frontend catches it perfectly
            return res.status(400).json({ message: "This activation link has expired or is invalid." });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "No system user account mapped to this registration token." });
        }

        if (user.isVerified) {
            return res.status(200).json({ message: "Profile already validated. Proceeding to auth portal dashboard." });
        }

        user.isVerified = true;
        await user.save();

        console.log(`[AUTH SYSTEM] Account for ${user.username || user.email} successfully verified!`);
        return res.status(200).json({ message: "Your Sports Connect profile has been authorized! Welcome aboard." });

    } catch (err) {
        console.error("Account verification endpoint failure:", err);
        res.status(500).json({ message: "Internal server validation fault.", error: err.message });
    }
});

// =========================================================
// 6. USER LOGIN PORTAL ENDPOINT
// =========================================================
router.post('/login', async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json("Email and Password payload parameters are mandatory.");
        }

        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (!user) return res.status(401).json("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json("Wrong password!");

        if (!user.isVerified) {
            return res.status(403).json("Please verify your account via the link sent to your email before logging in.");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            token,
            username: user.username,
            role: user.role,
            isVerified: user.isVerified, 
            city: user.city || "Hyderabad",
            interests: user.interests || []
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json("Internal Server Error");
    }
});

// (Keep your forgot-password and update-password endpoints below as they are)
router.post('/forgot-password', async (req, res) => { /* ... */ });
router.post('/update-password', async (req, res) => { /* ... */ });

module.exports = router;