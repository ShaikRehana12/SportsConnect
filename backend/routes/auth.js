const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/mailer');

// --- REGISTER ---
router.post('/register', async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json("Email and Password are required fields.");
        }

        const { email, password, interests, city, username, role } = req.body;

        // 1. Check if user already exists (Normalize email to lowercase)
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) return res.status(400).json("Email already registered!");

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user document structure
        const newUser = new User({
            username: username || email.split('@')[0], 
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            city: city || "Hyderabad",
            interests: interests || [],
            role: role || 'user',
            isVerified: false // Explicitly unverified until link completion
        });

        const user = await newUser.save();

        // 4. GENERATE AND DISPATCH INITIAL ACCOUNT VERIFICATION LINK
        try {
            const verificationToken = jwt.sign(
                { userId: user._id },
                "yourSecretKey",
                { expiresIn: "1h" }
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
                        
                        <p style="color: #64748b; font-size: 12px; text-align: center;">This link remains secure and active for the next 60 minutes.</p>
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

// --- RESEND VERIFICATION LINK ---
router.post("/resend-verification", async (req, res) => {
    try {
        if (!req.body || !req.body.email) {
            return res.status(400).json("Email address is required.");
        }

        // 1. Find user (Normalize email safely)
        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json("No account found with this email address.");
        }

        // 2. Prevent resending if account is already verified
        if (user.isVerified) {
            return res.status(400).json("This account is already verified. Please log in.");
        }

        // 3. Generate secure verification token (Expires in 1 hour)
        const verificationToken = jwt.sign(
            { userId: user._id },
            "yourSecretKey", 
            { expiresIn: "1h" }
        );

        const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

        // 4. Construct email parameters with your updated verified sender
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
                    
                    <p style="color: #64748b; font-size: 12px; text-align: center;">This link is valid for 60 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="color: #06b6d4; font-size: 13px; font-weight: bold; text-align: center; margin: 0;">SportsConnect Team India</p>
                </div>
            `
        };

        // 5. Run mail delivery engine
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

// --- FORGOT PASSWORD ---
router.post('/forgot-password', async (req, res) => {
    try {
        // Safe parameter extraction check to prevent crash if payload is undefined
        if (!req.body || !req.body.email) {
            return res.status(400).json("Email parameter is required.");
        }

        const email = req.body.email.toLowerCase().trim();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json("User not found");
        }

        const mailOptions = {
            from: '"SportsConnect 🏆" <sportsconnectteamindia.app@gmail.com>',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: sans-serif; border: 2px solid #06b6d4; padding: 20px; border-radius: 15px; max-width: 550px; margin: 0 auto; background-color: #ffffff;">
                    <h2 style="color: #06b6d4; text-transform: uppercase;">SportsConnect</h2>
                    <p style="color: #334155; font-size: 15px;">Hello <strong>${user.username}</strong>,</p>
                    <p style="color: #334155; font-size: 15px; line-height: 1.5;">You requested a password reset. Click the button below to update your password:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="http://localhost:3000/reset-password/${user._id}" 
                           style="background-color: #06b6d4; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);">
                           Reset Password
                        </a>
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #64748b; text-align: center;">If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error("Mail Error:", err);
                return res.status(500).json("Email failed to send");
            }
            return res.status(200).json("Email sent!");
        });
    } catch (err) {
        console.error("Forgot Password Logic Error:", err);
        return res.status(500).json("Internal Server Error");
    }
});

// --- UPDATE PASSWORD ---
router.post('/update-password', async (req, res) => {
    try {
        if (!req.body || !req.body.userId || !req.body.newPassword) {
            return res.status(400).json("userId and newPassword variables are required.");
        }

        const { userId, newPassword } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json("User not found");

        return res.status(200).json("Password updated successfully!");
    } catch (err) {
        console.error("Update Password Error:", err);
        return res.status(500).json("Server error during password update");
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json("Email and Password payload parameters are mandatory.");
        }

        const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
        if (!user) return res.status(401).json("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json("Wrong password!");

        // Create Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            "yourSecretKey", 
            { expiresIn: "1h" }
        );

        // Send detailed user data to frontend for localStorage mapping
        return res.status(200).json({
            token,
            username: user.username,
            role: user.role,
            city: user.city || "Hyderabad",
            interests: user.interests || []
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json("Internal Server Error");
    }
});

module.exports = router;