const router = require('express').Router();
const Tournament = require('../models/Tournament');

// 1. CREATE a Tournament (POST)
router.post('/add', async (req, res) => {
    const newTournament = new Tournament(req.body);
    try {
        const savedTournament = await newTournament.save();
        res.status(200).json(savedTournament);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. GET ALL Tournaments (READ)
router.get('/all', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json(tournaments);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;