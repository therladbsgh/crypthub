const mongoose = require('mongoose');

const { Schema } = mongoose;
const GameSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  playerPortfolioPublic: {
    type: Boolean,
    required: true
  },
  startingBalance: {
    type: Number,
    required: true
  },
  commissionValue: {
    type: Number,
    required: true
  },
  shortSelling: {
    type: Boolean,
    required: true
  },
  limitOrders: {
    type: Boolean,
    required: true
  },
  stopOrders: {
    type: Boolean,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  players: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    required: true
  },
  isPrivate: {
    type: Boolean,
    required: true
  },
  password: {
    type: String
  }
});

const model = mongoose.model('Game', GameSchema);

model.remove({}, () => {});
module.exports = model;
