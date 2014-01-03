/* API methods
------------*/

var db = require('./db'),
	data = require('./data'),
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
			data.authenticateUser({
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
			data.authenticateKey(
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
	app.param

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

	// search
	// returns array list of items
	app.get('/:base',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			console.log('get');
			console.log(req.params);
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

	// create
	// returns status with data
	app.post('/:base',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			console.log('post');
			console.log(req.params);
			// create user and respond with result or error
			data.createUser(req.body, function (err, results) {
				if (!err)
					response(res, 200, true, 'user created', results);
				else
					response(res, 500, false, err, null);
			});
		}
	);

	// update
	// returns status with no data
	app.put('/:base/:id',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			// search for user to update matching given id
			data.updateUser(req.body, function (err, results) {
				console.log('put');
				console.log(req.params);
				if (!err)
					response(res, 200, true, 'user updated', results);
				else
					response(res, 500, false, err, null);
			});
		}
	);

	// delete
	// returns status with no data
	app.delete('/:base/:id',
		passport.authenticate('localapikey', {
			session: false,
			failureRedirect: 'unauthorized'
		}),
		function (req, res) {
			console.log('delete');
			console.log(req.params);
			// search for and delete user matching given id
			data.deleteUser(req.params, function (err, results) {
				if (!err)
					response(res, 200, true, 'user deleted', results);
				else
					response(res, 500, false, err, null);
			});
		}
	);
};