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
	passport.use(new LocalAPIKeyStrategy({ apiKeyHeader: 'x-api-key' },
		function (apikey, done) {
			// check if valid api key
			auth.authenticateKey(
			apikey,
			function (err, results) {
				if (!err)
					return done(null, results);
				else
					throw err;
			});
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
		response(res, 401, false, 'Not Authorized', null);
	});

	// check for db tables
	// returns status and object with db tables info
	app.get('/dbtest', function (req, res) {
		// sql query using sequelize
		db.sequelize.query('SHOW TABLES FROM dev_db')
		.success(function (rows) {
			response(res, 200, true, 'Tables', rows);
		})
		.error(function (err) {
			response(res, 500, false, err, null);
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
	// returns status with user data
	app.post('/user/create',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			// create user and respond with result or error
			auth.createUser(req.body, function (err, results) {
				if (!err)
					response(res, 200, true, 'user created', results);
				else
					response(res, 500, false, err, null);
			});
		}
	);

	// update user
	// returns status with no data
	app.post('/user/update',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			// search for user to update matching given id
			auth.updateUser(req.body, function (err, results) {
				if (!err)
					response(res, 200, true, 'user updated', results);
				else
					response(res, 500, false, err, null);
			});
		}
	);

	// delete user
	// returns status with user data for successful insert
	app.post('/user/delete',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			// update user and respond with result or error
			db.User.update(req.body)
			.success(function () {
				response(res, 200, true, 'user updated', null);
			})
			.error(function (err) {
				response(res, 500, false, err, null);
			});
		}
	);

	// list users
	// returns status with list of users
	app.get('/user/list',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			// find all users and return list or error
			db.User.findAll()
			.success(function (users) {
				if (users)
					response(res, 200, true, 'users found', users);
				else
					response(res, 404, false, 'no users found', null);
			})
			.error(function (err) {
				response(res, 500, false, err, null);
			});
		}
	);
};