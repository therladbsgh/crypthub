const mongoose = require('mongoose');

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect('mongodb://35.192.71.2:4000', (error) => {
  if (error) {
    console.error('Please make sure Mongodb is running!');
    throw error;
  }
});

const mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'Connection error:'));
mongodb.once('open', () => {
  console.log('Connected to MongoDB!');
});
