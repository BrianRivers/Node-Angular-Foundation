// require modules
var http = require('http'),
	cors = require('cors'),
	express = require('express'),
	passport = require('passport'),
	fs = require('fs');

// create app
var app = express();

// configure app
app.configure(function () {
	app
	.use(express.methodOverride())
	.use(express.bodyParser())
	.use(passport.initialize())
	.use(cors())
	.use(app.router)
	// serve static website in public folder
	.use(express.static( __dirname + '/public'))
	// handle 404 not found
	.use(function (req, res, next) {
		res.status(404).send('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});
});

// run initial user setup
var auth = require('./app/auth');
auth.intialSetup(function (err, results) {
	if (err) throw err;
	fs.writeFile('test/userdata.json', JSON.stringify(results), function (err) {
		if (err) throw err;
		console.log('User created and written to data file');
	});
});

// require api routes and functions
var api = require('./app/api');
// send app to api to handle incoming requests
api(app);

// start server
app.listen(8001, '127.0.0.1');
console.log('Listening on http://localhost:3001');