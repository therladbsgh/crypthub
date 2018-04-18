const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    ref: 'User' },

  token: { 
    type: String, 
    required: true },

    createdAt: { 
      type: Date, 
      required: true, 
      default: Date.now, 
      expires: 86400 }
});

const model = mongoose.model('Token', TokenSchema);
module.exports = model;
