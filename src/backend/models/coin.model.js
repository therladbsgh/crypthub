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

const Model = mongoose.model('Coin', CoinSchema);

const btc = new Model({
  _id: new mongoose.Types.ObjectId(),
  name: 'Bitcoin',
  symbol: 'BTC',
  currPrice: 1000
});

const eth = new Model({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ethereum',
  symbol: 'ETH',
  currPrice: 1000
});

btc.save();
eth.save();

module.exports = Model;
