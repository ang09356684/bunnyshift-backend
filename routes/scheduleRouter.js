const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/scheduleController');



//test
router.get('/' , (req, res, next) => {
    res.send('into api schedule');
});

router.use('/test', scheduleController.test);
router.post('/setweekshift', scheduleController.setWeekShift);
router.post('/setdateshift', scheduleController.setDateShift);
router.post('/settimeshift', scheduleController.setTimeShift);
router.post('/setschedule', scheduleController.setSchedule);
router.post('/setworker', scheduleController.setWorker);
router.post('/setleave', scheduleController.setLeave);
router.post('/deletedateshift', scheduleController.deleteDateShift);
router.post('/deletetimeshift', scheduleController.deleteTimeShift);
router.delete('/removeworkerinschedule', scheduleController.removeWorkerinSchedule);
module.exports = router;
