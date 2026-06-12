// const mongoose = require('mongoose');

// const tournamentSchema = new mongoose.Schema({
//     title: String,
//     sportType: String,
//     location: String,
//     date: String,
//     image: String,
// });

// module.exports = mongoose.model('Tournament', tournamentSchema);
// const mongoose = require('mongoose');

// const tournamentSchema = new mongoose.Schema({
//     title: { 
//         type: String, 
//         required: [true, "Tournament title is required"],
//         trim: true 
//     },
//     sportType: { 
//         type: String, 
//         required: [true, "Please specify the sport (e.g., Cricket, Badminton)"],
//         enum: ['Cricket', 'Football', 'Badminton', 'Basketball', 'Chess'] // Limits choices to these sports
//     },
//     location: { 
//         type: String, 
//         required: [true, "Location is required"] 
//     },
//     date: { 
//         type: String, // You can also use Date type, but String is fine if you're sending formatted dates
//         required: [true, "Date is required"] 
//     },
//     image: { 
//         type: String, 
//         default: "default-sports.jpg" // Provides a fallback image if none is uploaded
//     },
// }, { 
//     timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
// });

// module.exports = mongoose.model('Tournament', tournamentSchema);
// const mongoose = require('mongoose');

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
    organizer: {
        type: String
    },
    image: { 
        type: String, 
        default: "default-sports.jpg",
        trim: true
    }
}, { 
    timestamps: true 
});

tournamentSchema.index({ sportType: 1 });

module.exports = mongoose.model('Tournament', tournamentSchema);