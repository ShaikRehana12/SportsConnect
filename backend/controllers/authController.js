const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER LOGIC
exports.register = async (req, res) => {
    try {
        const { username, email, password, city, interests } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Create new user
        user = new User({ username, email, password, city, interests });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).send("Server error during registration");
    }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "your_jwt_secret", // In production, move this to .env file
            { expiresIn: '1h' }
        );

        // 🌟 FORCE EXPLICIT STRING CASTING FOR IDENTIFIERS
        res.json({
            token,
            username: user.username,
            role: user.role,
            city: user.city,
            interests: user.interests,
            _id: String(user._id),       // 🚀 Convert ObjectId safely to String
            userId: String(user._id),    // 🚀 Convert ObjectId safely to String
            isVerified: user.isVerified ?? true 
        });
    } catch (err) {
        res.status(500).send("Server error during login");
    }
};