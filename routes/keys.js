const router = require('express').Router();

const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');

const ECPair = ECPairFactory(ecc)

router.get('/private', (req, res) => {
  return (
    res.send(
      ECPair.makeRandom()
        .privateKey
        .toString('hex')
    )
  );
});

router.get('/public', (req, res) => {
  //body will get private key
  //params will indicate compressed or nah
  //default to compressed
  const { privateKey } = req.body;
  const keyPair = ECPair.fromPrivateKey(privateKey);

  const { compressed } = req.query;

  if (compressed === 0) {
    return res.send(
      keyPair.publicKey
    )
  }
  const pubKeyCompressed = keyPair.publicKey.toString('hex')
  return res.send(
    pubKeyCompressed
  )
})

module.exports = router;