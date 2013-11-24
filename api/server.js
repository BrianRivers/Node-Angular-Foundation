var http = require('http'),
	express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function (username, password, done) {
		if (username == 'test' && password == 'password')
			return done(null, username);
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
    app.use(express.cookieParser('secret'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieSession());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(function (req, res, next){
		res.status(404).send('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});
});

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/invalid', function (req, res) {
	res.json('Not Authorized');
});

app.post('/local',
	passport.authenticate('local', {
		session: false,
		failureRedirect: '/invalid'
	}),
	function (req, res) {
		res.json('Valid Credentials');
	}
);

app.listen(3000, '127.0.0.1');
console.log('Listening on port 3000');