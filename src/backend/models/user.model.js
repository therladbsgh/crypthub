const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.statics = {
  /**
   * Gets the user by ID.
   * @param  {string} id - The id
   * @return {Promise<User>}
   */
  get(id) {
    return this.findById(id).exec().then(user => user);
  },
};

const model = mongoose.model('User', UserSchema);
module.exports = model;
