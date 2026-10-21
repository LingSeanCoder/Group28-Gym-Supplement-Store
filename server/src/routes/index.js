const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/health', healthController.check);
router.get('/health/db', healthController.checkDb);

module.exports = router;