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