const router = require('express').Router();
const {requireAuth} = require('../services/passport');
const {fundWallet} = require('../bitcoin/transactions');

router.post('/fund-wallet', requireAuth, fundWallet);


module.exports = router;