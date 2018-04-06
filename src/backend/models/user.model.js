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
   * @return {Promise<User, APIError>}
   */
  get(id) {
    this.findbyid(id).exec().then((user) => {
      if (user) return user;
      return Promise.reject(new Error('No user exists'));
    });
  },
};

const model = mongoose.model('User', UserSchema);
module.exports = model;
