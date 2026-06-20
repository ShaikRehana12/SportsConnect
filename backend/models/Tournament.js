/**
 * Tournament Schema for Sports Connect Web Application
 * Handles validation and constraints for database match storage
 */
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Tournament title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    sportType: { 
        type: String, 
        required: [true, "Please specify the sport type"],
        trim: true,
        enum: {
            values: ['Cricket', 'Football', 'Badminton', 'Basketball', 'Chess', 'Volleyball', 'Tennis'],
            message: '{VALUE} is not a supported sport type'
        }
    },
    location: { 
        type: String, 
        required: [true, "Location is required"],
        trim: true
    },
    date: { 
        type: String, 
        required: [true, "Date is required"],
        trim: true
    },
    time: { 
        type: String, 
        trim: true
    },
    maxPlayers: { 
        type: Number, 
        default: 10
    },
    entryFee: {
        type: Number,
        default: 0 // Captured seamlessly from your creation request body
    },
    organizer: {
        type: String
    },
    image: { 
        type: String, 
        default: "default-sports.jpg",
        trim: true
    },
    // Track registered users dynamically & prevent .some() undefined crashes
    players: {
        type: [String], // Stores User ID strings or references
        default: []     // Crucial: guarantees an array exists on initialization
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Dynamic virtual field to calculate seats remaining instantly
tournamentSchema.virtual('slotsLeft').get(function() {
    return Math.max(0, this.maxPlayers - (this.players ? this.players.length : 0));
});

tournamentSchema.index({ sportType: 1 });

module.exports = mongoose.model('Tournament', tournamentSchema);