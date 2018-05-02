const User = require('../models/user.model');

/**
 * Gets the user by ID.
 * @param  req.params.id - The id
 *
 * @return User object
 */
function get(req, res) {
  User.get(req.params.id).then((result) => {
    if (!result) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json({ result });
  }).catch((err) => {
    console.log(err);
    res.json({ err });
  });
}

/**
 * Create new user
 *
 * @param  req.body.username - The username
 * @param  req.body.password - The password
 * @param  req.body.email - The email
 *
 * @return User object
 */
function create(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.save().then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    res.status(500).json({ err });
  })
}

function remove(req, res) {
  const username = req.body.username;

  User.remove({ username }).exec().then(() => {
    res.status(200).json({ success: true });
  }).catch(() => {
    res.status(500).json({ err: 'MongoDB removal error' });
  })
}

module.exports = {
  get,
  create,
  remove
};
