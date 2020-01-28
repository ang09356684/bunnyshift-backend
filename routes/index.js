const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

const registerRouter = require('./registerRouter');
const loginRouter = require('./loginRouter');
const devSearchRouter = require('./devSearchRouter');
const searchRouter = require('./searchRouter');
const scheduleRouter = require('./scheduleRouter');
const leaveRouter = require('./leaveRouter');
const updateRouter = require('./updateRouter');

router.get('/' , (req,res,next) => {
    res.send('into api RouteIndex');
});

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/devsearch',devSearchRouter);
router.use(authController.verifyToken);
router.use('/search', searchRouter);
router.use('/schedule', scheduleRouter);
router.use('/leave', leaveRouter);
router.use('/update', updateRouter);


module.exports = router;