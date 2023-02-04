const router = require('express').Router();
const { requireAuth } = require('../services/passport');
const bitcoin = require('bitcoinjs-lib');
const User = require('../models/user');
const { generateP2pkh } = require('../bitcoin/addresses');
const Wallet = require('../models/wallet').WalletModel;

router.post('/', requireAuth, (req, res) => {
  const { address, keys, type } = req.body;

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

      Array.isArray(keys) ? keys.forEach(key => wallet.keys.push(key)) : wallet.keys.push(keys)

      req.user.wallets.push(wallet);

      req.user.save((err, user) => {
        if (err) { return res.send(err) };
      });
      wallet.save((err, wallet) => {
        if (err) { return res.send(err) };
        return res.send(wallet);
      });
    };
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  };
});

router.post('/p2pkh', requireAuth, generateP2pkh, (req, res) => {
  const address = req.p2pkh;
  const {keys} = req.body;
  try {
    const result = bitcoin.address.fromBase58Check(address);
    if (result) {
      const wallet = new Wallet({
        address,
        type: 'p2pkh',
      });

      Array.isArray(keys) ? keys.forEach(key => wallet.keys.push(key)) : wallet.keys.push(keys)

      req.user.wallets.push(wallet);

      req.user.save((err, user) => {
        if (err) { return res.send(err) };
      });
      wallet.save((err, wallet) => {
        if (err) { return res.send(err) };
        return res.send(wallet);
      });
    };
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  };
})

router.get('/', requireAuth, async (req, res) => {
  return res.json(req.user.wallets);
});

module.exports = router;