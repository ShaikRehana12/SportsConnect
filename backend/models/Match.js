const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    sport: {
      type: String,
      required: true,
      // Ensure these match your frontend dropdown options exactly
      enum: ["Cricket", "Football", "Badminton", "Basketball", "Chess", "Tennis", "Volleyball"],
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String, // e.g., "2026-05-10"
      required: true,
    },
    time: {
      type: String, // e.g., "18:00"
      required: true,
    },
    maxPlayers: {
      type: Number,
      default: 10,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "full", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);