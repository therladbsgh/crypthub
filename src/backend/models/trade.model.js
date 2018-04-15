const mongoose = require('mongoose');

const { Schema } = mongoose;
const TradeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  side: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  symbol: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  GTC: {
    type: Boolean,
    required: true
  },
  filled: {
    type: Boolean,
    required: true
  }
});

const model = mongoose.model('Trade', TradeSchema);
module.exports = model;
