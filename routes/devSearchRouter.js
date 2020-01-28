const express = require('express');
const router = express.Router();

const devSearchController = require('../controllers/devSearchController');

router.get('/company', devSearchController.company);
router.get('/staff', devSearchController.staff);
router.get('/dateshift', devSearchController.dateShift);
router.get('/timeshift', devSearchController.timeShift);

module.exports = router;