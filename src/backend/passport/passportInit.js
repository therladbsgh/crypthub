const login = require('./login');
const signup = require('./signin');
const User = require('../models/user.model');

function initPassport(passport) {
  // Passport needs to be able to serialize and
  // deserialize users to support persistent login sessions
  passport.serializeUser((user, done) => {
    console.log('serializing user: ');
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      console.log('deserializing user:', user);
      done(err, user);
    });
  });

  // Setting up Passport Strategies for Login and SignUp/Registration
  login(passport);
  signup(passport);
}

module.exports = initPassport;
