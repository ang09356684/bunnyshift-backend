const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');



//test
router.get('/' , (req, res, next) => {
    res.send('into api login');
});

router.use('/test', loginController.test);
router.post('/company', loginController.companyLogin);
router.post('/staff', loginController.staffLogin);

module.exports = router;