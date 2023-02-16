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
  const addresses = await req.user.wallets.map(async (reqAddress) => {
    const address = await Wallet.findById(reqAddress._id).populate('transactions');

    const balance = await getAddrBalance(address.address);
    address.balance = balance;

    address.save();

    return address;
  })
  Promise.all(addresses).then(addrs => res.json(addrs));
});

router.delete('/', requireAuth, async (req, res) => {
 try {
   await  Wallet.findByIdAndDelete(req.query.id);
   res.status(200).end();
 } catch (error) {
  res.status(500).send(error);
 }
})
module.exports = router;