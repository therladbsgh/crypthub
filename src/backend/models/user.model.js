const mongoose = require('mongoose');

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
  }
});

UserSchema.statics = {
  /**
   * Gets the user by Username.
   */
  get(username) {
    return this.find({ username }).exec().then(user => user);
  }
};

const model = mongoose.model('User', UserSchema);
module.exports = model;
