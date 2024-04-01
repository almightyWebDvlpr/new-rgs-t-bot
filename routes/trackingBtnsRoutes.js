const express = require('express');
const router = express.Router();
const trackingBtnsController = require('../controllers/trackingBtnsController.js');

router.get('/tracks', trackingBtnsController.getAllTrackingRequests);

module.exports = router;