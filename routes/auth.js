const router = require('express').Router();
const passport = require('passport');
const passportServices = require('../services/passport');
const Authentication = require('../controllers/authentication');
const {requireAuth} = require('../services/passport');

const requireSignin = passport.authenticate('local', {session: false});

router.post('/login', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);
router.get('/current_user', requireAuth, Authentication.currentUser)

module.exports = router;