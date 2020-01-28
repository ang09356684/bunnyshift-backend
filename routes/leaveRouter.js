const express = require('express');
const router = express.Router();

const leaveController = require('../controllers/leaveController');

//test
router.get('/' , (req, res, next) => {
    res.send('into api leave');
});

router.use('/test', leaveController.test);
router.post('/leaveneeddeputy', leaveController.leaveNeedDeputy);
router.post('/leavewithoutdeputy', leaveController.leaveWithoutDeputy);
router.get('/checkallleaveinfobycompany', leaveController.checkAllLeaveInfoByCompany);//公司看所有請假紀錄
router.get('/checkleaveinfobycompany', leaveController.checkLeaveInfoByCompany);//只看要審核的
router.post('/companyreviewleave', leaveController.companyReviewLeave);//回復審核
router.get('/checkdeputyinfobystaff', leaveController.checkDeputyInfoByStaff);
router.post('/staffreviewdeputy', leaveController.staffReviewDeputy);
router.get('/checkleaveinfobystaff', leaveController.checkLeaveInfoByStaff);
router.post('/firestaff', leaveController.fireStaff);
module.exports = router;