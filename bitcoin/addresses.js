const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');

const { KeyModel } = require('../models/key');
const { WalletModel } = require('../models/wallet');
const { TransactionModel } = require('../models/transaction');
const { getAddrBalance, getAddrTxes } = require('./rpcUtils');

const ECPair = ECPairFactory(ecc);

module.exports.generateP2pkh = async (req, res, next) => {
  const { keys, network } = req.body;
  const { publicKey } = await KeyModel.findById(keys);

  const addressObj =
    bitcoin.payments.p2pkh({
      pubkey: Buffer.from(publicKey, 'hex'),
      network: bitcoin.networks[network],
    });

  req.p2pkh = addressObj.address;
  next();
};

module.exports.updateAddr = async (address, userId, addressId) => {
  try {
    const balance = await getAddrBalance(address);
    const txes = await getAddrTxes(address);

    const txDocs = txes.map(async (tx) => {
      const txDoc = await TransactionModel.findOne({ txid: tx.txid });
      // transaction already exists in db, dont make another
      if (txDoc) {
        return txDoc;
      };

      const newTx = new TransactionModel({
        txid: tx.txid,
        recipient: userId,
        amount: tx.amount,
        coinbase: true,
        address: tx.address,
        scriptPubKey: tx.scriptPubKey,
        confirmations: tx.confirmations,
        vout: tx.vout,
      })

      newTx.save(err => {
        if (err) { throw (err); };
      });

      return newTx;
    })

    const resolvedTxes = await Promise.all(txDocs)
    const userAddr = await WalletModel.findOne(addressId);

    userAddr.transactions = resolvedTxes;
    userAddr.balance = balance;

    userAddr.save();

    return userAddr;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports.updateAllAddrs = async (req, res, next) => {
  try {
    let addresses = req.user.wallets;

    if (addresses) {
      return await addresses.map(async (address) => {
        await this.updateAddr(address.address, req.user._id, address._id);
      });
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
