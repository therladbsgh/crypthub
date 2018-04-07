const express = require('express');
const db = require('./db');

const bCrypt = require('bcrypt-nodejs');


const routes = require('./routes/index.js');


const app = express();


const localStrategy = require('passport-local').Strategy;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', routes);

app.get('/getData', (req, res) => {
  console.log('hit getData endpoint');
  res.send({ data: 'this is data' });
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:5000');
});

// configure passport
const passport = require('passport'); 
const expressSession = require('express-session');

//app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// configure flash 
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passportInit');
initPassport(passport);

// potentially not needed 
// var routes = require('./routes/index')(passport);
// app.use('/', routes);


