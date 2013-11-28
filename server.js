var http = require('http'),
	cors = require('cors'),
	express = require('express'),
	passport = require('passport');

// create app
var app = express();

// configure app
app.configure(function () {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(passport.initialize());
	app.use(cors());
	app.use(app.router);
	app.use(express.static( __dirname + '/app'));
	app.use(function (req, res, next) {
		res.status(404).send('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});
});

// set up api routes
require('./routes/api')(app);

// start server
app.listen(3000, '127.0.0.1');
console.log('Listening on port 3000');