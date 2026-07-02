const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route untuk menambah poin
router.post('/add-points', userController.addPoints);

// Route untuk update profile
router.put('/update-profile', userController.updateProfile);

// Route untuk leaderboard
router.get('/leaderboard', userController.getLeaderboard);

// Route untuk admin stats
router.get('/admin/stats', userController.getAdminStats);

// Route untuk hapus user (Admin only)
router.delete('/admin/users/:id', userController.deleteUser);

// Route untuk update stats (points, exp, level)
router.post('/update-stats', userController.updateStats);

module.exports = router;
