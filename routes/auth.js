const router = require('express').Router();
const Authentication = require('../controllers/authentication');

router.post('/signup', Authentication.signup)

module.exports = router;