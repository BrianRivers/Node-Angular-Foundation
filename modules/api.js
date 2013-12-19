module.exports = function(app) {
	
	var helper = require('./helpers'),
		mysql = require('mysql-activerecord'),
		uuid = require('node-uuid'),
		bcrypt = require('bcrypt'),
		moment = require('moment'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		LocalAPIKeyStrategy = require('passport-localapikey').Strategy;


	var db = mysql.Adapter({
		host: '10.0.2.15',
		database: 'dev_db',
		user: 'dev_db',
		password: 'giscenter'
	});

	/* Passport strategies and methods
	------------*/

	function createUser() {
		console.log('create user test');
	}

	function updateTimestamp(user_id) {
		var time = moment();
		db
		.where({ user_id: user_id })
		.update('api_keys', {
			timestamp: time
		},
		function (err) {
			return (!err) ? true : false;
		});
	}
	
	// verify user
	passport.use(new LocalStrategy(
		function (username, password, done) {
			// search for user
			db
			.where({ username: username })
			.get('users', function (err, rows, fields) {
				// return error
				if (err) return done(err);
				if (rows[0] !== undefined) {
					// check if password matches
					if (bcrypt.compareSync(password, rows[0].password)) {
						delete rows[0].password;
						var result = updateTimestamp(rows[0].id);
						if (result)
							return done(null, rows[0]);
						else
							return done(null, false);
					} else {
						return done(null, false);
					}
				} else {
					return done(null, false);
				}
			});
		})
	);

	// verify api key
	passport.use(new LocalAPIKeyStrategy({ apiKeyField: 'x-api-key' },
		function (apikey, done) {
			// search for api key
			db
			.where({ key: apikey })
			.get('api_keys', function (err, rows, fields) {
				// return error
				if (err) return done(err);
				else {
					// determine difference in time since last access
					var now = moment();
					var timestamp = moment(rows[0].timestamp);
					var diff = now.diff(timestamp);
					console.log(diff);
					// check if user should sign in again or master key
					if (diff < 60000 || rows[0].id == 1) {
						return done(null, rows[0]);
					} else {
						return done(null, false);
					}
				}
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

	/* API methods
	------------*/

	// check for db tables
	// returns status and object with db tables info
	app.get('/dbtest', function (req, res) {
		db.query('SHOW TABLES FROM dev_db', function (err, results) {
			if (!err) {
				response(res, 200, true, "Tables", results);
			} else {
				response(res, 500, false, err.message, null);
			}
		});
	});

	// response for unauthorized users
	// returns status with no data
	app.get('/unauthorized', function (req, res) {
		response(res, 401, false, "Not Authorized", null);
	});

	// verify username and password
	// returns status and object with user info and key
	app.post('/authenticate',
		passport.authenticate('local', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			db
			.where({ user_id: req.user.id })
			.get('api_keys', function (err, rows, fields) {
				// search for api key for user
				if (!err) {
					if (rows[0] !== undefined) {
						response(res, 200, true, "Authorized", {
							"user": req.user,
							"key": rows[0].key
						});
					} else {
						res.redirect('unauthorized');
					}
				} else {
					response(res, 500, false, err.message, null);
				}
			});
		}
	);

	// create user
	// returns status with db data for successful insert
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
			var result = helper.createUser(new_user);
			response(res, 200, true, 'test', result);
		}
	);
};