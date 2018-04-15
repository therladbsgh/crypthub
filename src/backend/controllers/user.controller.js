const User = require('../models/user.model');

/**
 * Gets the user by ID.
 * @param  req.params.id - The id
 * @return User object
 */
function get(req, res) {
  User.get(req.params.id).then((result) => {
    res.json({ result });
  }).catch((err) => {
    res.json({ err });
  });
}

/**
 * Create new user
 *
 * @param  req.body.username - The username
 * @param  req.body.password - The password
 * @param  req.body.email - The email
 * @return User object
 */
function create(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.save().then((result) => {
    res.json(result);
  });
}

module.exports = {
  get,
  create
};
