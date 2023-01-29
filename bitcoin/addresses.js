const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');

const ECPair = ECPairFactory(ecc);

module.exports.generateP2pkh = (req, res, next) => {
  const { publicKey, network } = req.body;

  const addressObj =
    bitcoin.payments.p2pkh({
      pubkey: Buffer.from(publicKey, 'hex'),
      network: bitcoin.networks[network]
    });

  req.p2pkh = addressObj.address;
  next();
}