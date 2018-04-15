const mongoose = require('mongoose');

const { Schema } = mongoose;
const CoinSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  currPrice: {
    type: Number,
    required: true
  }
});

const model = mongoose.model('Coin', CoinSchema);
module.exports = model;
