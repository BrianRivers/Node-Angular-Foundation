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
			// search for user
			db
			.where({ username: username })
			.get('users', function (err, rows, fields) {
				// return error
				if (err) return done(err);
				if (rows[0] !== undefined) {
					// check if password matches
					if (bcrypt.compareSync(password, rows[0].password))
						return done(null, rows[0]);
					else
						return done(null, null);
				} else {
					return done(null, null);
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

	// response for unauthorized users
	// returns status with no data
	app.get('/unauthorized', function (req, res) {
		response(res, 403, false, "Not Authorized", null);
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
						response(res, 200, true, "Authorized", {
							"user": req.user
						});
					}
				} else {
					response(res, 500, false, err.message, null);
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
			response(res, 200, true, "Authorized", null);
			// sends back api key info
			// "data": req.user
		}
	);

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

	app.post('/user/create', function (req, res) {
		//generate hash and salt for password
		var hash = bcrypt.hashSync(req.body.password, 10);
		db.insert('users', {
			username: req.body.username,
			password: hash,
			first_name: req.body.first_name,
			last_name: req.body.last_name
		},
		function (err, results) {
			if (!err) {
				response(res, 200, true, "created new user ", results);
			} else {
				response(res, 500, false, err.message, null);
			}
		});
	});
};