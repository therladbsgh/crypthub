const mongoose = require('mongoose');

const { Schema } = mongoose;
const BotSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  log: {
    type: String,
    default: ''
  }
});

const model = mongoose.model('Bot', BotSchema);
module.exports = model;
