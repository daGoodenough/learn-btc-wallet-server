const router = require('express').Router();
const { requireAuth } = require('../services/passport');
const { fundWallet, createRawTx, broadcastRaw } = require('../bitcoin/transactions');
const { getTx } = require('../bitcoin/rpcUtils');

router.post('/fund-wallet', requireAuth, fundWallet);

router.post('/create-raw/p2pkh', requireAuth, createRawTx);

router.post('/broadcast', requireAuth, broadcastRaw);

router.get('/raw', async (req, res) => {
  try {
    const { txid } = req.query;
    if (!txid) {
      return res.end();
    }

    const decoded = await getTx(txid);

    res.json(decoded);
  } catch (error) {
    res.status(500).send(error);
  }
})


module.exports = router;