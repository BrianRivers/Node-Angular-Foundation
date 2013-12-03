module.exports = function(app) {
	
	var mysql = require('mysql-activerecord'),
		uuid = require('node-uuid'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

	// create connection to db
	var db = mysql.Adapter({
		host: 'localhost',
		database: 'pyrocms',
		user: 'pyrocms',
		password: '5cJzQDGqeKE8rdxb'
	});

	/* Passport strategies and methods
	------------*/
	
	passport.use(new LocalStrategy(
		function (username, password, done) {
			// search for user with password
			db
			.where({
				username: username,
				// password: password
			})
			.get('default_users', function (err, rows, fields) {
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
			db
			.where({
				key: apikey
			})
			.get('default_api_keys', function (err, rows, fields) {
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

	/* API methods
	------------*/

	// response for unauthorized users
	app.get('/unauthorized', function (req, res) {
		res.json({
			"status": {
				"success": false,
				"message": "Not Authorized"
			},
			"data": null
		});
	});

	// verify username and password
	app.post('/authenticate',
		passport.authenticate('local', {
			session: false,
			//must add api/ to url redirects on server
			failureRedirect: 'api/unauthorized'
		}),
		function (req, res) {
			db
			.where({
				user_id: req.user.id
			})
			.get('default_api_keys', function (err, rows, fields) {
				if (!err) {
					res.json({
						"status": {
							"success": true,
							"message": "Authorized"
						},
						"data":{
							"user": req.user,
							"key": rows[0].key
						}
					});
				}
				else {
					res.json({
						"status": {
							"success": false,
							"message": err
						},
						"data": null
					});
				}
			});
		}
	);

	// verify api key
	app.post('/keytest',
		passport.authenticate('localapikey', {
			session: false,
			//must add api/ to url redirects on server
			failureRedirect: 'api/unauthorized'
		}),
		function (req, res) {
			res.json({
				"status": {
					"success": true,
					"message": "Authorized"
				},
				"data": null
				// sends back api key info
				// "data": req.user 
			});
		}
	);

	app.post('/search', function (req, res) {
		var table = req.body.resource;
		delete req.body.resource;
		res.json(req.body);
	});

};