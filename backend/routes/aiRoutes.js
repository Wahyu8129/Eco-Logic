const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route untuk mengirim pesan ke AI
router.post('/chat', aiController.chatWithAI);

// Route untuk identifikasi gambar/teks
router.post('/identify', aiController.identifyWaste);

module.exports = router;
