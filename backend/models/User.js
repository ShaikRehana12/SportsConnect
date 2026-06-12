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
    // CRITICAL: Added for the Step C Notification logic
    city: {
        type: String,
        required: true,
        default: 'Hyderabad', // Or leave empty if you want them to type it
        trim: true
    },
    // Array of sports for matching notifications
    interests: {
        type: [String], 
        default: []
    },
    // Optional: useful for match coordination
    phone: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);