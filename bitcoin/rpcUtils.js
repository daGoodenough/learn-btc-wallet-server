const rpc = require('./rpc');

module.exports.getAddrBalance = async (address) => {
  return new Promise((resolve, reject) => {
    rpc(
      'getreceivedbyaddress',
      [address], (err, data) => {
        if (err) { reject(err); }
        console.log("Data: ", data);
        resolve(data);
      }
    );
  });
}

module.exports.faucet = async (address, amount = 1, fee = 0.00001) => {
  return new Promise((resolve, reject) => {
    rpc('settxfee', [fee], (err, response) => {
      if (err) { reject(err); };
      resolve(response);
    });
  })
    .then(response => new Promise((resolve, reject) => {
      if (!response) { reject() };

      rpc('sendtoaddress', [address, amount], (err, txid) => {
        if (err) { reject(err); };
        resolve(txid);
      });
    }))
    .catch(error => {
      throw new Error(error);
    });
};

module.exports.coinbase = async (address, amount = 1) => {
  return new Promise((resolve, reject) => {
    rpc('generatetoaddress', [amount, address], (err, blocks) => {
      if (err) { reject(err); };

      resolve(blocks);
    });
  });
}