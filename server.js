// Get dependencies and prepare Express
const express 			    = require('express');
const app 				    = express();

// Point static path to dist
app.use(express.static(__dirname + '/dist'));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';

// Run Listener for App.
var listener = app.listen(port, function(){
	console.log("APP Listening at port: ", listener.address().port);
});