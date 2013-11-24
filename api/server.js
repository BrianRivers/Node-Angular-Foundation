var http = require('http'),
	cors = require('cors'),
	uuid = require('node-uuid'),
	express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

passport.use(new LocalStrategy(
	function (username, password, done) {
		if (username == 'test' && password == 'password')
			return done(null, username);
		else
			return done(null, false);
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
	res.json({
		"status": [
			{ "success": "success message" },
			{ "error": "error message" }
		],
		"data": "Hello World"
	});
});

app.get('/unauthorized', function (req, res) {
	res.json('Not Authorized');
});

app.post('/authenticate',
	passport.authenticate('local', {
		session: false,
		failureRedirect: 'unauthorized'
		//must add api/ to url redirects on server
	}),
	function (req, res) {
		res.json('Valid Credentials');
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

app.listen(3000, '127.0.0.1');
console.log('Listening on port 3000');