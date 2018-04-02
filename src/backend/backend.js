const express = require('express');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/getData', function(req, res) {
    console.log('hit getData endpoint');
	res.send({ data: 'this is data' });
});

app.listen(5000, function(err) {
	if (err) {
	  	console.log(err);
	  	return;
	}
  
	console.log('Listening at http://localhost:5000');
});