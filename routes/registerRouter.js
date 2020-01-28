const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');



//test
router.get('/' , (req, res, next) => {
    res.send('into api register');
});

router.use('/test', registerController.test);
router.post('/company', registerController.companyRegister);
router.post('/staff', registerController.staffRegister);

module.exports = router;