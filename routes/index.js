const router = require('express').Router();


const authRoutes = require('./auth');
 router.use('/auth', authRoutes);

const keyRoutes = require('./keys');
 router.use('/api/keys', keyRoutes);

const addressRoutes = require('./addresses');
  router.use('/api/address', addressRoutes);

module.exports = router;