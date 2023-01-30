const router = require('express').Router();
const { requireAuth } = require('../services/passport');
const bitcoin = require('bitcoinjs-lib');
const User = require('../models/user');
const Wallet = require('../models/wallet').WalletModel;

router.post('/', requireAuth, (req, res) => {
  const { address, keys, type } = req.body;

  console.log(req.body)

  if (!(address || keys || type)) {
    return res.status(400).send("Address, wallet type, and keys used to create address required");
  };

  try {
    const result = bitcoin.address.fromBase58Check(req.body.address);
    if (result) {
      const wallet = new Wallet({
        address,
        type,
      });

      keys.forEach(key => wallet.keys.push(key));

      req.user.wallets.push(wallet);

      req.user.save((err, user) => {
        if (err) { return res.send(err) };
        return res.send(user);
      });
    };
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  };
});

module.exports = router;