const rpc = require('./rpc');

module.exports.getAddrBalance = async (address) => {
  return new Promise((resolve, reject) => {
    rpc(
      'getreceivedbyaddress',
      [address, 0], (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      }
    );
  })
  .then(balance => balance)
  .catch(error => console.log(error));
};

module.exports.getAddrTxes = async (address, minconf = 0, maxconf = 99999999, includeUnsafe = true) => {
  return new Promise((resolve, reject) => {
    rpc(
      'listunspent',
      [minconf, maxconf, [address], includeUnsafe],
      (err, transactions) => {
        if (err) { reject(err); };
        resolve(transactions);
      }
    )
  })
  .then(transactions => transactions)
  .catch(error => console.log(error));
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
};

module.exports.getTx = async (txid) => {
  return new Promise((resolve, reject) => {
    rpc('gettransaction', [txid, true, true], (err, tx) => {
      if (err) { reject(err) }

      resolve(tx);
    })
  })
};

module.exports.decodeRawTx = async (txHex) => {
  return new Promise((resolve, reject) => {
    rpc('decoderawtransaction', [txHex], (err, decoded) => {
      { if (err) reject(err); };

      resolve(decoded);
    });
  });
};

module.exports.broadcast = async (txHex) => {
  return new Promise((resolve, reject) => {
    rpc('sendrawtransaction', [txHex], (err, txid) => {
      if (err) { reject(err); };

      resolve(txid);
    });
  });
};

