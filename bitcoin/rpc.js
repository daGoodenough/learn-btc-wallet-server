module.exports = require('yajrpc/qup')({
  url: process.env.RPC || 'http://localhost:8332',
  user: "user",
  pass: "password",
  batch: process.env.RPCBATCHSIZE || 500,
  concurrent: process.env.RPCCONCURRENT || 16
})