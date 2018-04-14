const passportLocal = require('passport-local');
const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');

const LocalStrategy = passportLocal.Strategy;

// Generates hash using bCrypt
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function signup(passport) {
  passport.use('signup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      console.log('IM HERE: ', req.body);
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
            return done(null, false, { message: 'User already exists'});
          }

          // if there is no user with that email
          // create the user
          const newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.body.email;
          newUser.firstName = 'firstname';
          newUser.lastName = 'lastname';

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
// need a function that takes the sign up object from the front end

module.exports = signup;
