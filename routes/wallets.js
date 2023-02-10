const router = require('express').Router();
const { requireAuth } = require('../services/passport');
const bitcoin = require('bitcoinjs-lib');
const User = require('../models/user');
const { generateP2pkh } = require('../bitcoin/addresses');
const Wallet = require('../models/wallet').WalletModel;
const rpc = require('../bitcoin/rpc');
const { getAddrBalance } = require('../bitcoin/rpcUtils');

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
  const { keys, name } = req.body;
  try {
    const result = bitcoin.address.fromBase58Check(address);
    if (result) {
      const wallet = new Wallet({
        address,
        type: 'p2pkh',
        walletName: name,
        balance: 0,
      });

      Array.isArray(keys) ? keys.forEach(key => wallet.keys.push(key)) : wallet.keys.push(keys)

      req.user.wallets.push(wallet);

      rpc('importaddress', [address, wallet._id], (err) => {
        if (err) { return res.send(err) }
      });

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
  req.user.wallets.forEach(async (userWallet) => {
    const address = await Wallet.findById(userWallet._id);
    const balance = await getAddrBalance(address.address);
    console.log(balance);

    address.balance = balance;
    address.save();

    userWallet.balance = balance;
  })
  return res.json(req.user.wallets);
});

module.exports = router;