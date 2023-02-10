const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');

const { WalletModel } = require('../models/wallet');
const { TransactionModel } = require('../models/transaction');
const { faucet, coinbase, getAddrBalance } = require('./rpcUtils');

const ECPair = ECPairFactory(ecc);

module.exports.generateCoinbase = (req, res, next) => {
  try {
    const { wif, address } = req.body;

    if (!(wif || address)) {
      res.status(400).send("Wif and address required")
    }
    const keyPair = ECPair.fromWIF(wif);

    // convert address to output script... returns a buffer
    const outputScript = bitcoin.address.toOutputScript(address);
    const value = Number(req.body.value) || 50 * 1e8;
    const tx = new bitcoin.Transaction();
    //adds a coinbase input (32 bytes of 0's)
    tx.addInput(Buffer.alloc(32, 0), 0);
    // adds output spending to p2pkh address
    tx.addOutput(outputScript, value);
    //creates a hash that will be used to sign the input
    const hashForSig = tx.hashForSignature(
      0,
      tx.ins[0].script,
      bitcoin.Transaction.SIGHASH_ALL
    );
    const signature = keyPair.sign(hashForSig);

    //no errors but unsure if this is right.
    //signature is the signed tx, but not a scriptSig
    tx.setInputScript(0, signature);

    const [input, output] = [tx.ins[0], tx.outs[0]];

    res.json({
      input: {
        hash: input.hash.toString('hex'),
        index: input.index,
        script: input.script.toString('hex')
      },
      output: {
        script: output.script.toString('hex'),
        value,
        address,
        segwit: false,
      }
    });
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports.fundWallet = async (req, res, next) => {
  try {
    const { addressId, amount, fee } = req.body;
    const address = await WalletModel.findById(addressId);

    const txid = await faucet(address.address);
    
    //mine one block so that the faucet tx goes through;
    const blocks = await coinbase(process.env.FAUCET_ADDRESS);

    const newBalance = await getAddrBalance(address.address);

    address.balance = newBalance;
    
    const tx = new TransactionModel({
      txid,
      recipient: req.user.id,
      amountSent: amount || 1,
      fee: fee || 0.00001,
      coinbase: true,
    })

    tx.save();
    
    address.transactions.push(tx._id);
    address.save();

    res.json(newBalance);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
}
