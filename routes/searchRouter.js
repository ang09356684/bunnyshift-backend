const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');



//test
router.get('/' , (req, res, next) => {
    res.send('into api search');
});

router.use('/test', searchController.test);
router.get('/companyinfo', searchController.companySelfInfo);
router.get('/staffinfo', searchController.staffSelfInfo);
router.get('/staffinfobycompany', searchController.staffInfoByCompany);
router.get('/dateshiftbycompany/', searchController.dateShiftByCompany);
router.get('/timeshiftbycompany',searchController.timeShiftByCompany);
router.get('/weekshiftbycompany', searchController.weekShiftByCompany);
router.get('/shiftbycompany/', searchController.shiftByCompany);
router.get('/staffandshift', searchController.shiftAndStaffInfo);
router.get('/calendar/:year/:month', searchController.calendar);
router.get('/preschedule/:year/:month/', searchController.preSchedule);
router.get('/schedule/:year/:month/:ltdID/', searchController.schedule);
router.get('/schedulebydate/:dateID/:ltdID/', searchController.scheduleByDate);
router.get('/schedulebystaff/:year/:month/:ltdID/', searchController.scheduleByStaff);
router.get('/leavelist/', searchController.leaveList);
router.get('/leavelistbystaff/:ltdID/', searchController.leaveListByStaff);


module.exports = router;