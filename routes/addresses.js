const router = require('express').Router();
const { generateP2pkh } = require('../bitcoin/addresses');

//generate a p2pkh address from pubkey in body
router.get('/p2pkh', generateP2pkh, (req, res) => {
  res.send(req.p2pkh);
})

module.exports = router;