const passportLocal = require('passport-local');
const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');

const LocalStrategy = passportLocal.Strategy;

// Generates hash using bCrypt
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function signin(passport) {
  passport.use('signup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      process.nextTick(() => {
        // Find a user in Mongo with provided username
        User.findOne({ username }, (err, user) => {
          // In case of any error, return using the done method
          if (err) {
            console.log('Error in SignUp: ', err);
            return done(err);
          }

          // already exists
          if (user) {
            console.log('User already exists with username: ', username);
            return done(null, false, req.flash('message', 'User Already Exists'));
          }

          // if there is no user with that email
          // create the user
          const newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // save the user
          newUser.save((err2) => {
            if (err2) {
              console.log('Error in Saving user: ', err2);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        });
      });
    }
  ));
}

module.exports = signin;
