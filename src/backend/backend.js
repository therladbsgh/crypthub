const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');

const db = require('./db');
const router = require('./routes/index.js');

//setup api
var api = require('./api');

// Setup express server
const app = express();

app.use(bodyParser.json());
app.use(fileUpload());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Setup sessions

const MongoStore = connectMongo(session);
app.use(cookieParser('secret'));
app.use(session({
  key: 'user_sid',
  cookie: { maxAge: 600000 },
  store: new MongoStore({ mongooseConnection: db }),
  saveUninitialized: true,
  resave: true,
  secret: 'secret'
}));

app.post('/', function(request, response){
  api(request, response);
});


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
