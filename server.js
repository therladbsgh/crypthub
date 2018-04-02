const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname + '/dist')));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'), function(err) {
	  	if (err) {
			res.status(500).send(err);
	  	}
	})
})

app.listen(8080, function(err) {
	if (err) {
	  	console.log(err);
	  	return;
	}
  
	console.log('Listening at http://localhost:8080');
});