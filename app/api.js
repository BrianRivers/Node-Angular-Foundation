/* API methods
------------*/

var db = require('./db'),
	auth = require('./auth'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

module.exports = function(app) {

	/* Passport strategies and methods
	----------------------------------*/
	
	// verify user
	passport.use(new LocalStrategy(
		function (username, password, done) {
			// check if valid user
			auth.authenticateUser({
				username: username,
				password: password
			},
			// return user or error
			function (err, results) {
				if (!err)
					return done(null, results);
				else
					return done(err);
			});
		})
	);

	// verify api key
	passport.use(new LocalAPIKeyStrategy({ apiKeyField: 'x-api-key' },
		function (apikey, done) {
			// check if valid api key
			return done(null, false);
		})
	);

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	// creates and sends api response
	function response(res, code, success, message, data) {
		res.json(code, {
			"status": {
				"success": success,
				"message": message
			},
			"data": data
		});
	}

	/* Routes
	---------*/

	// response for unauthorized users
	// returns status with no data
	app.get('/unauthorized', function (req, res) {
		response(res, 401, false, "Not Authorized", null);
	});

	// check for db tables
	// returns status and object with db tables info
	app.get('/dbtest', function (req, res) {
		// sql query using sequelize
		db.sequelize.query('SHOW TABLES FROM dev_db')
		.success(function (rows) {
			response(res, 200, true, "Tables", rows);
		})
		.error(function (errors) {
			response(res, 500, false, "Database error", errors);
		});
	});

	// verify username and password
	// returns status and object with user info and key
	app.post('/authenticate',
		passport.authenticate('local', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			response(res, 200, true, 'Authorized', {
				"user": req.user
			});
		}
	);

	// create user
	// returns status with user data for successful insert
	app.post('/user/create',
		// passport.authenticate('localapikey', {
		// 	session: false,
		// 	failureRedirect: 'unauthorized'
		// }),
		function (req, res) {
			var new_user = {
				username: req.body.username,
				password: req.body.password,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email
			};
			// create user and respond with result or error
			auth.createUser(new_user, function (err, results) {
				if (!err)
					response(res, 200, true, 'user created', results);
				else
					response(res, 500, false, 'Database error', err);
			});
		}
	);
};