var http = require('http'),
	cors = require('cors'),
	mysql = require('mysql'),
	uuid = require('node-uuid'),
	express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

var connection = mysql.createConnection({
	host		: 'localhost',
	database	: 'pyrocms',
	user		: 'pyrocms',
	password	: '5cJzQDGqeKE8rdxb'
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		// query binding and escaping for sql query
		connection.query('SELECT * FROM default_users WHERE username = ?', [username], function (err, rows, fields) {
			if (err)
				return done(err);
			else {
				return done(null, rows[0]);
			}
		});
	})
);

passport.use(new LocalAPIKeyStrategy({
		apiKeyField: 'X-API-KEY'
	},
	function (apikey, done) {
		if (apikey == '9c1c7725-b92b-41f2-b3fa-78dc845a3192')
			return done(null, apikey);
		else
			return done(null, false);
	})
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var app = express();

app.configure(function () {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(passport.initialize());
	app.use(cors());
	app.use(app.router);
	app.use(function (req, res, next) {
		res.status(404).send('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});
});

app.get('/', function (req, res) {
	console.log('index');
	res.json({
		"status": [
			{ "success": "success message" },
			{ "error": "error message" }
		],
		"data": "Hello World"
	});
});

app.get('/unauthorized', function (req, res) {
	res.json({
		"status": {
			"success": null,
			"error": "Not Authorized"
		},
		"data": null
	});
});

app.post('/authenticate',
	passport.authenticate('local', {
		session: false,
		failureRedirect: 'api/unauthorized'
		//must add api/ to url redirects on server
	}),
	function (req, res) {
		res.json({
			"status": {
				"success": "User found",
				"error": "Authorized"
			},
			"data": req.user
		});
	}
);

app.post('/keytest',
	passport.authenticate('localapikey', {
		session: false,
		failureRedirect: 'unauthorized'
		//must add api/ to url redirects on server
	}),
	function (req, res) {
		res.json('Valid API Key');
	}
);

app.get('/dbtest', function (req, res) {
	connection.query('SELECT * FROM default_fadeptmt', function(err, rows, fields) {
		if (err)
			res.json(err);
		else
			res.json(rows);
	});
});

app.post('/search', function (req, res) {
	var table = req.body.resource;
	delete req.body.resource;
	res.json(req.body);
});

app.listen(3000, '127.0.0.1');
console.log('Listening on port 3000');