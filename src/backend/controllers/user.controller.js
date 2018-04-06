const User = require('../models/user.model');

/**
 * Gets the user by ID.
 * @param  {string} req.params.id - The id
 * @return {User}
 */
function get(req, res) {
  User.get(req.params.id).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.json(err);
  });
}

/**
 * Create new user
 *
 * @param  {string} req.body.username - The username
 * @param  {string} req.body.password - The password
 * @param  {string} req.body.email - The email
 * @return {User}
 */
function create(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  user.save().then((result) => {
    res.json(result);
  });
}

module.exports = {
  get,
  create,
};
