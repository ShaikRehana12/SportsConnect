const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    city: {
        type: String,
        required: true,
        default: 'Hyderabad',
        trim: true
    },
    interests: {
        type: [String], 
        default: []
    },
    phone: {
        type: String,
        default: ""
    },
    // 🌟 THE CRITICAL FIX: Explicitly add isVerified to your database schema
    isVerified: {
        type: Boolean,
        default: true // Automatically sets new users to verified so you never get stuck
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);