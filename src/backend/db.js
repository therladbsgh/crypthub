const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

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

<<<<<<< HEAD
=======
// Messsages
>>>>>>> 68c9435d1b7433b13defb50e9de1e5b0b088b93b
mongodb.on('error', console.error.bind(console, 'Connection error:'));
mongodb.once('open', () => {
  console.log('Connected to MongoDB!');
});


// make collection for userData 

module.exports =  mongoose.model('User',{
	id: Number,
	firstName: String,
	lastName: String,
	username: String,
	email: String,
	password: String, 
	currentGames: [],
	possibleGames: [],

});





