const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const { Schema, model } = mongoose;
const UserModel = require('./user');

const TransactionSchema = new Schema({
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  recipient: {type: Schema.Types.ObjectId, ref: 'User'},
  amount: Number,
  txid: String,
  coinbase: Boolean,
  scriptPubKey: String,
  address: String,
})

const TransactionModel = model('Transaction', TransactionSchema);

module.exports = {TransactionModel, TransactionSchema};