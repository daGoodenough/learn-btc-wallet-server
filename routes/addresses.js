const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const passportServices = require('../services/passport');
const { generateP2pkh } = require('../bitcoin/addresses');

const requireAuth = passport.authenticate('jwt', { session: false });

router.use((req, res, next) => {
  if (!req.body.network) {
    req.body.network = 'testnet';
  }
  next();
})

//generate a p2pkh address from pubkey in body
router.get('/p2pkh', generateP2pkh, (req, res) => {
  res.send(req.p2pkh);
})

module.exports = router;