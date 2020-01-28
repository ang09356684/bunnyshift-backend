const express = require('express');
const router = express.Router();

const updateController = require('../controllers/updateController');

//test
router.get('/' , (req, res, next) => {
    res.send('into api update');
});

router.use('/test', updateController.test);
router.put('/company', updateController.updateCompanyInfo);
router.put('/staff', updateController.updateStaffInfo);
router.put('/dateshift', updateController.updateDateShift);
router.put('/timeshift', updateController.updateTimeShift);
router.put('/weekshift', updateController.updateWeekShift);
module.exports = router;