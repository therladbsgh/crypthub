const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bCrypt = require('bcrypt-nodejs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const flash = require('express-flash');

const db = require('./db');
const initPassport = require('./passport/passportInit');
const router = require('./routes/index.js');

const app = express();
const sessionStore = new session.MemoryStore;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cookieParser('secret'));
app.use(session({
  key: 'user_sid',
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: true,
  secret: 'secret'
}));

// Configure flash
app.use(flash());

// Configure passport
// app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
initPassport(passport);

// Configure router
app.use('/', router(passport));

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:5000');
});
