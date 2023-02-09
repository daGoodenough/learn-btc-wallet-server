const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { Schema } = mongoose;

const KeySchema = new Schema({
  privateKey: String,
  publicKey: String,
  isCompressed: Boolean,
  wif: String,
  network: String,
  keyName: String,
});

const KeyModel = mongoose.model('Key', KeySchema);

module.exports = {KeyModel, KeySchema};