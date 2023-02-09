const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { Schema, model } = mongoose;
// const TransactionSchema = requrie('./transaction');
const {KeySchema} = require('./key');

const WalletSchema = new Schema({
  walletName: String,
  address: String,
  keys: [{type: Schema.Types.ObjectId, ref: 'Key'}],
  type: String,
  balance: Number,
  transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
})

const WalletModel = model('Wallet', WalletSchema);

module.exports = {WalletModel, WalletSchema};