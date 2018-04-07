const express = require('express');
const expressSession = require('express-session');
const bCrypt = require('bcrypt-nodejs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const db = require('./db');
const initPassport = require('./passport/passportInit');
const router = require('./routes/index.js');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configure passport
// app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Configure flash
app.use(flash());

// Initialize Passport
initPassport(passport);

// Configure router
app.use('/', router);

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:5000');
});
