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
  path: {
    type: String,
    required: true
  }
});

const model = mongoose.model('Bot', BotSchema);
module.exports = model;
