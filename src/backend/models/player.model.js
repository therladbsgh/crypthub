const mongoose = require('mongoose');

const { Schema } = mongoose;
const PlayerSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  netWorth: {
    type: Number,
    required: true
  },
  numTrades: {
    type: Number,
    required: true
  },
  netReturn: {
    type: Number,
    required: true
  },
  todayReturn: {
    type: Number,
    required: true
  },
  currRank: {
    type: Number,
    required: true
  },
  buyingPower: {
    type: Number,
    required: true
  },
  shortReserve: {
    type: Number,
    required: true
  },
  portfolio: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
    required: true
  },
  transactionHistory: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],
    default: []
  },
  transactionCurrent: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],
    default: []
  }
});

const model = mongoose.model('Player', PlayerSchema);

module.exports = model;
