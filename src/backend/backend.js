const express = require('express');
const db = require('./db');
const routes = require('./routes/index.js');

const app = express();

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
