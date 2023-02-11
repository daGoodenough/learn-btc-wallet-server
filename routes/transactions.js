const router = require('express').Router();
const { requireAuth } = require('../services/passport');
const { fundWallet, createRawTx } = require('../bitcoin/transactions');

router.post('/fund-wallet', requireAuth, fundWallet);
router.post('/create-raw/p2pkh', requireAuth, createRawTx)


module.exports = router;