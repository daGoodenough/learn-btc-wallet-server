const router = require('express').Router();

router.use((req, res, next) => {
  if (!req.body.network) {
    req.body.network = 'regtest';
  }
  next();
})

const authRoutes = require('./auth');
 router.use('/auth', authRoutes);

const keyRoutes = require('./keys');
 router.use('/api/keys', keyRoutes);

const addressRoutes = require('./addresses');
  router.use('/api/address', addressRoutes);

const walletRoutes = require('./wallets');
  router.use('/api/wallets', walletRoutes);

const transactionRoutes = require('./transactions');
  router.use('/api/transactions', transactionRoutes);

module.exports = router;