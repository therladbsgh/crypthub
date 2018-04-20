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
  },
  todayReturn: {
    type: Number
  }
});

const Model = mongoose.model('Coin', CoinSchema);

Model.findOne({ symbol: 'BTC' }, (err, result) => {
  if (!err) {
    if (!result) {
      const btc = new Model({
        _id: new mongoose.Types.ObjectId(),
        name: 'Bitcoin',
        symbol: 'BTC',
        currPrice: 1000,
        todayReturn: 5.22
      });
      btc.save();
    }
  }
});

Model.findOne({ symbol: 'ETH' }, (err, result) => {
  if (!err) {
    if (!result) {
      const eth = new Model({
        _id: new mongoose.Types.ObjectId(),
        name: 'Ethereum',
        symbol: 'ETH',
        currPrice: 1000,
        todayReturn: 5.22
      });
      eth.save();
    }
  }
});

Model.findOne({ symbol: 'USD' }, (err, result) => {
  if (!err) {
    if (!result) {
      const usd = new Model({
        _id: new mongoose.Types.ObjectId(),
        name: 'US Dollars',
        symbol: 'USD',
        currPrice: 1,
        todayReturn: undefined
      });
      usd.save();
    }
  }
});

module.exports = Model;
