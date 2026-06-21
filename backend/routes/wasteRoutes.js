const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');

router.post('/priority', wasteController.getWastePriority);

module.exports = router;
