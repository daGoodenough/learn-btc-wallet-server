const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const crypto = require('crypto');
const { Schema } = mongoose;
const WalletSchema = './wallet';
const KeySchema = './key';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  hash: String,
  salt: String,
  keys: [KeySchema],
  wallets: [WalletSchema],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;