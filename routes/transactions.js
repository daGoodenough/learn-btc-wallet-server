const router = require('express').Router();
const {requireAuth} = require('../services/passport');
const {generateCoinbase} = require('../bitcoin/transactions');

router.post('/fund-wallet', requireAuth, generateCoinbase);

module.exports = router;