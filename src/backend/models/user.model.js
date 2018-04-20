const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  games: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    default: []
  },
  ELO: {
    type: Number,
    default: 1000
  },
  tradingBots: {
    type: [String],
    default: []
  }
});

UserSchema.statics = {
  /**
   * Gets the user by Username.
   */
  get(username) {
    return this.findOne({ username }).populate('games').exec().then(user => user);
  }
};

const model = mongoose.model('User', UserSchema);
module.exports = model;
