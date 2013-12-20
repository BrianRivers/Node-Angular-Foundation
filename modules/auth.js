var uuid = require('node-uuid'),
	bcrypt = require('bcrypt'),
	moment = require('moment'),
	mysql = require('mysql-activerecord');

var db = mysql.Adapter({
		host: '10.0.2.15',
		database: 'dev_db',
		user: 'dev_db',
		password: 'giscenter'
});

var intialSetup = function intialSetup() {
	var admin_user = {
		username: 'admin',
		password: 'giscenter',
		first_name: null,
		last_name: null,
		email: 'apgiscenter@gmail.com'
	};
	createUser(admin_user);
};

var createUser = function createUser(user) {
	user.password = bcrypt.hashSync(user.password, 10);
	db.insert('users', user, function (err, info) {
		return 'test';
	});
};

// create connection to db
module.exports.db = db;
module.exports.intialSetup = intialSetup;
module.exports.createUser = createUser;