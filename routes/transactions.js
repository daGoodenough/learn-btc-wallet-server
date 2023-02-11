const router = require('express').Router();
const { requireAuth } = require('../services/passport');
const { fundWallet, createRawTx, broadcastRaw } = require('../bitcoin/transactions');

router.post('/fund-wallet', requireAuth, fundWallet);
router.post('/create-raw/p2pkh', requireAuth, createRawTx);
router.post('/broadcast', broadcastRaw);


module.exports = router;