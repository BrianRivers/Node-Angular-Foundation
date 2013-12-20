var db = require('./db'),
	uuid = require('node-uuid'),
	bcrypt = require('bcrypt'),
	moment = require('moment');

var intialSetup = function intialSetup(callback) {
	var admin_user = {
		username: 'admin',
		password: 'giscenter',
		first_name: null,
		last_name: null,
		email: 'apgiscenter@gmail.com'
	};
	createUser(admin_user, callback);
};

var createUser = function createUser(user, callback) {
	//insert user into db
	user.password = bcrypt.hashSync(user.password, 10);
	db.User.create(user)
	.success(function (user, created) {
		callback(null, user.values);
	})
	.error(function (errors) {
		callback(errors, false);
	});
};

module.exports.intialSetup = intialSetup;
module.exports.createUser = createUser;