const router = require('express').Router();

const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const wif = require('wif');
const {requireAuth} = require('../services/passport')
const User = require('../models/user');
const Key = require('../models/key').KeyModel;

const ECPair = ECPairFactory(ecc)

router.get('/private', (req, res) => {
  const privateKey =
    ECPair.makeRandom()
      .privateKey
      .toString('hex');

  const privKeyBuffer = Buffer.from(privateKey, 'hex');

  const version = 128;

  const wifCompressed = wif.encode(version, privKeyBuffer, true);
  const wifUncompressed = wif.encode(version, privKeyBuffer, false);

  return (
    res.json({
      privateKey,
      wifCompressed,
      wifUncompressed,
    })
  );
});

router.get('/public', (req, res) => {
  //body will get private key
  //params will indicate compressed or nah
  //default to compressed
  let { privateKey, wifEncoded } = req.body;
  let { compressed } = req.query;

  if (!privateKey && !wifEncoded) {
    //no keys were provided to generate from
    const keyPair = compressed ? 
      ECPair.makeRandom({compressed: true}) : 
      ECPair.makeRandom({compressed: false});

    return res.json({
      publicKey: keyPair.publicKey.toString('hex'),
      privateKey: keyPair.privateKey.toString('hex'),
    })
  }


  if(wifEncoded) {
    const wifDecoded = wif.decode(wifEncoded);

    privateKey = wifDecoded.privateKey.toString('hex');
    compressed = wifDecoded.compressed;
  }
  
  const buffer = Buffer.from(privateKey, 'hex');
  
  if (compressed === false) {
    const keyPair = ECPair.fromPrivateKey(buffer, { compressed: false });
    return res.send(
      keyPair.publicKey.toString('hex')
    );
  };

  const keyPair = ECPair.fromPrivateKey(buffer);
  const pubKeyCompressed = keyPair.publicKey.toString('hex')

  return res.send(
    pubKeyCompressed
  )
})

router.post('/', requireAuth, (req, res) => {
  const {privateKey, publicKey, keyName, compressed, network} = req.body;

  if(!(privateKey || publicKey || keyName)){
    return res.status(400).send("Private and public keys and key pair name are all required");
  };

 const key = new Key({
  privateKey,
  publicKey,
  network: network || null,
  compressed: compressed || null,
  keyName
 })

 req.user.keys.push(key);
  // User.findById(req.user.id, (err, user) => {
  //   if(err) {res.send(err)};


  // })
  req.user.save((err, user) => {
    if(err) {return res.send(err)}
  });
  key.save(err => {
    if(err){return res.send(err)}
    return res.send(key);
  })
})

module.exports = router;