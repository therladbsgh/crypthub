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
  coin: {
    type: Schema.Types.ObjectId,
    ref: 'Coin',
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
  },
  filledDate: {
    type: Date
  }
});

const model = mongoose.model('Trade', TradeSchema);

module.exports = model;
