const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route untuk menambah poin
router.post('/add-points', userController.addPoints);

// Route untuk update profile
router.put('/update-profile', userController.updateProfile);

// Route untuk leaderboard
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
