var http = require('http'),
	cors = require('cors'),
	express = require('express'),
	passport = require('passport');

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
	.use(express.static( __dirname + '/public'))
	.use(function (req, res, next) {
		res.status(404).send('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});
});

// set up api routes
require('./routes/api')(app);

// start server
app.listen(8001, '127.0.0.1');
console.log('Listening on http://localhost:3001');
