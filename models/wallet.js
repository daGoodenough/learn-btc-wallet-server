const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { Schema, model } = mongoose;
// const TransactionSchema = requrie('./transaction');
const {KeySchema} = require('./key');

const WalletSchema = new Schema({
  address: String,
  keys: [KeySchema],
  type: String,
  balance: Number,
  transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
})

const WalletModel = model('Wallet', WalletSchema);

module.exports = {WalletModel, WalletSchema};