/* User authenticaion and creation methods
------------------------------------------*/
var db = require('./db'),
	uuid = require('node-uuid'),
	bcrypt = require('bcrypt'),
	moment = require('moment');

var intialSetup = function intialSetup(callback) {
	db.sequelize
	.sync({force: true})
	.complete(function (err) {
		if (err) throw err;
		else {
			var admin_user = {
				username: 'admin',
				password: 'giscenter',
				first_name: null,
				last_name: null,
				email: 'apgiscenter@gmail.com'
			};
			createUser(admin_user, callback);
		}
	});
};

var createUser = function createUser(user, callback) {
	// insert user into db
	user.password = bcrypt.hashSync(user.password, 10);
	db.User.create(user)
	.success(function (user, created) {
		callback(null, user.values);
	})
	.error(function (errors) {
		callback(errors, false);
	});
};

var authenticateUser = function authenticateUser(user, callback) {
	// search for user
	db.User.find({where: {username: user.username}})
	.success(function (result) {
		// if user is found
		if (result) {
			// check password hash against provided password
			if (bcrypt.compareSync(user.password, result.password)) {
				callback(null, result);
			} else {
				callback(null, false);
			}
		} else {
			callback(null, false);
		}
	})
	.error(function (errors) {
		callback(errors, false);
	});
};

module.exports.intialSetup = intialSetup;
module.exports.createUser = createUser;
module.exports.authenticateUser = authenticateUser;