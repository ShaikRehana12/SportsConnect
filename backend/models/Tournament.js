const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    title: String,
    sportType: String,
    location: String,
    date: String,
    image: String,
});

module.exports = mongoose.model('Tournament', tournamentSchema);