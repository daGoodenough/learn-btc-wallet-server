const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const { RegtestUtils } = require('regtest-client')
const regtestUtils = new RegtestUtils(bitcoin)

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
  const address = req.body;
  try {
    const network = regtestUtils.network // regtest network params

    const keyPair = ECPair.makeRandom({ network })
    const p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })


    console.log(p2pkh.address);

    const unspent = await regtestUtils.faucet(p2pkh.address, 2e4)

    console.log(unspent);

    const fetchedTx = await regtestUtils.fetch(unspent.txId)

    console.log(fetchedTx);

    const results = await regtestUtils.mine(6)
    console.log(results);
    // await regtestUtils.faucet(address, 50);
  } catch (error) {
    console.log(error);
  }
  // const walletBalance = await regtestUtils.unspents(address);
  // console.log(walletBalance);
  res.end();
}
