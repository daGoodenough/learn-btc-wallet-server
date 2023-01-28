const router = require('express').Router();

const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const wif = require('wif');

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
  
  if (compressed === false || compressed === '0') {
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

module.exports = router;