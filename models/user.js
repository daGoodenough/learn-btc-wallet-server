const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const crypto = require('crypto');
const { Schema } = mongoose;
const WalletSchema = './wallet';
const KeySchema = './key';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: {type: String, unique: true},
  hash: String,
  salt: String,
  keys: [KeySchema],
  wallets: [WalletSchema],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

UserSchema.methods.setPassword = (password, user) => {
  user.salt = crypto.randomBytes(16).toString('hex');
  user.hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = (password, user) => {
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

  return user.hash === hash;
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;