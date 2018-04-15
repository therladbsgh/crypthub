const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const connectMongo = require('connect-mongo');

const db = require('./db');
const router = require('./routes/index.js');

// Setup express server
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Setup sessions

app.use(cookieParser('secret'));
app.use(session({
  name: 'session',
  maxAge: 60000,
  signed: false,
  secret: 'secret'
}));

// Configure router
app.use('/', router);

// Start server
app.listen(5000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:5000');
});
