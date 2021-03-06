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

CoinSchema.statics = {
  /**
   * Gets all coins but USD.
   */
  get() {
    return this.find({ symbol: { $ne: 'USD' } }).exec().then(user => user.map(x => x.symbol));
  },

  getAll() {
    return this.find({}).exec().then(user => user.map(x => x.symbol));
  }
};

const Model = mongoose.model('Coin', CoinSchema);

Model.findOne({ symbol: 'BTC' }).exec().then((result) => {
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
});

Model.findOne({ symbol: 'ETH' }).exec().then((result) => {
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
});

Model.findOne({ symbol: 'USD' }).exec().then((result) => {
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
});

setTimeout(() => {
  Model.getAll().then((coins) => {
    console.log(coins);
  });
}, 3000);

module.exports = Model;
