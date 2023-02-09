const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const {KeyModel} = require('../models/key');

const ECPair = ECPairFactory(ecc);

module.exports.generateP2pkh = async (req, res, next) => {
  const { keys, network } = req.body;
  const { publicKey } = await KeyModel.findById(keys)

  const addressObj =
    bitcoin.payments.p2pkh({
      pubkey: Buffer.from(publicKey, 'hex'),
      network: bitcoin.networks[network]
    });

  req.p2pkh = addressObj.address;
  next();
}