module.exports = function(app) {
	
	var mysql = require('mysql-activerecord'),
		uuid = require('node-uuid'),
		bcrypt = require('bcrypt'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

	// create connection to db
	var db = mysql.Adapter({
		host: '10.0.2.15',
		database: 'dev_db',
		user: 'dev_db',
		password: 'giscenter'
	});

	/* Passport strategies and methods
	------------*/
	
	// verify user
	passport.use(new LocalStrategy(
		function (username, password, done) {
			// search for user with password
			db
			.where({ username: username, password: password })
			.get('users', function (err, rows, fields) {
				// return result
				if (err)
					return done(err);
				else {
					return done(null, rows[0]);
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
				// return result
				if (err)
					return done(err);
				else {
					return done(null, rows[0]);
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
	function response(res, success, message, data) {
		res.json({
			"status": {
				"success": success,
				"message": message
			},
			"data": data
		});
	}

	/* API methods
	------------*/

	// response for unauthorized users
	// returns status with no data
	app.get('/unauthorized', function (req, res) {
		response(res, false, "Not Authorized", null);
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
					if (rows[0]) {
						response(res, true, "Authorized", {
							"user": req.user,
							"key": rows[0].key
						});
					} else {
						res.redirect('unauthorized');
					}
				} else {
					response(res, false, err.message, null);
				}
			});
		}
	);

	// verify api key
	// returns status with no data
	app.post('/keytest',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			response(res, true, "Authorized", null);
			// sends back api key info
			// "data": req.user
		}
	);

	// check for db tables
	// returns status and object with db tables info
	app.get('/dbtest', function (req, res) {
		db.query('SHOW TABLES FROM dev_db', function (err, results) {
			if (!err) {
				response(res, true, "Tables", results);
			} else {
				response(res, false, err.message, null);
			}
		});
	});

	app.post('/search', function (req, res) {
		var table = req.body.resource;
		delete req.body.resource;
		res.json(req.body);
	});

	app.post('/user/create', function (req, res) {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);
		db.insert('users', {
			username: req.body.username,
			password: hash,
			first_name: req.body.first_name,
			last_name: req.body.last_name
		},
		function (err, results) {
			if (!err) {
				response(res, true, "created new user ", results);
			} else {
				response(res, false, err.message, null);
			}
		});
	});
};