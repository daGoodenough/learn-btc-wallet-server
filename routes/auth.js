const router = require('express').Router();
const passport = require('passport');
const passportServices = require('../services/passport');
const Authentication = require('../controllers/authentication');

const requireSignin = passport.authenticate('local', {session: false});

router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup)

module.exports = router;