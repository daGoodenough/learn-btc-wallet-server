const router = require('express').Router();
const passport = require('passport');
const { address } = require('bitcoinjs-lib')
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

router.post('/', requireAuth, (req, res) => {
  try {
    const result = address.fromBase58Check(req.body.address);
    if (result) {
      User.findById(req.user.id, (err, user) => {
        user.wallets.push(req.body.address);

        user.save((err, user) => {
          if (err) { res.status(500).send("Error saving user") };

         return res.send({ wallets: user.wallets });
        });
      })
    }
  } catch (error) {
    console.log(error);
    res.status('400').send('Invalid address');
  }
})

module.exports = router;