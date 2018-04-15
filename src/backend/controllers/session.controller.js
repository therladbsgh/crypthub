const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');


/**
 * Generates hash using bCrypt
 * @param  password : The password
 * @return the hashed password
 */
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/**
 * Compares password string to a hashed string
 * @param  user : The user object from MongoDB
 * @param  password : The hashed password string
 * @return true if password and hashed string match, false otherwise
 */
function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

/**
 * Sign up method.
 * @param  req : The request
 * @param  res : The response
 * @return 500 on server error, 401 if user exists, 200 if success
 */
function signup(req, res) {
  const { username, password, email } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ err: 'MongoDB Server Error: Cannot query' });
      return;
    }

    if (user) {
      console.log('User already exists with username: ', username);
      res.status(401).send({ err: 'Username already exists', field: 'username' });
      return;
    }

    const newUser = new User();

    newUser.username = username;
    newUser.password = createHash(password);
    newUser.email = email;

    newUser.save((err2) => {
      if (err2) {
        res.status(500).send({ err: 'MongoDB Server Error: Cannot save' });
        return;
      }
      res.status(200).json({ result: newUser });
    });
  });
}

/**
 * Login method.
 * @param  req : The request
 * @param  res : The response
 * @return 500 on server error, 401 if user does not exist, 200 if success
 */
function login(req, res) {
  console.log(req.session);
  const loginObj = req.body.login;
  const { password } = req.body;

  User.findOne({ $or: [{ username: loginObj }, { email: loginObj }] }, (err, user) => {
    if (err) {
      res.status(500).json({ err: 'MongoDB Server Error: Cannot query' });
      return;
    }

    if (!user) {
      res.status(401).send({ err: 'User not found', field: 'username' });
      return;
    }

    if (!isValidPassword(user, password)) {
      res.status(401).send({ err: 'Invalid password', field: 'password' });
      return;
    }

    req.session.user = user.username;
    req.session.save();
    res.status(200).send({ success: true, user: user.username });
  });
}


/**
 * Logout method.
 * @param  req : The request
 * @param  res : The response
 * @return 500 on server error, 200 if success
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ err: 'Server Error: Failed to destroy session' });
      return;
    }

    res.status(200).json({ success: true });
  });
}


/**
 * Authentication middleware.
 * @param  req : The request
 * @param  res : The response
 * @return 403 if authentication failed, calls next otherwise
 */
function authenticate(req, res, next) {
  if (req.session.user) {
    res.status(403).json({ err: 'Not logged in' });
  } else {
    next();
  }
}

/**
 * Gets user name from session.
 * @param  req : The request
 * @param  res : The response
 * @return user name if exists, null otherwise
 */
function getUser(req, res) {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({});
  }
}

module.exports = {
  signup,
  login,
  logout,
  authenticate,
  getUser
};
