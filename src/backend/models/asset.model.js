const mongoose = require('mongoose');

const { Schema } = mongoose;
const AssetSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  coin: {
    type: Schema.Types.ObjectId,
    ref: 'Coin',
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const model = mongoose.model('Asset', AssetSchema);

module.exports = model;
