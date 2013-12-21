/* User authenticaion and creation methods
------------------------------------------*/

var db = require('./db'),
	uuid = require('node-uuid'),
	bcrypt = require('bcrypt'),
	moment = require('moment');

// runs inital db setup and creates default admin user
var intialSetup = function intialSetup(callback) {
	db.sequelize
	.sync({force: true})
	.complete(function (err) {
		if (err) throw err;
		else {
			var admin_user = {
				username: 'admin',
				password: 'giscenter',
				firstName: null,
				lastName: null,
				email: 'apgiscenter@gmail.com'
			};
			createUser(admin_user, callback);
		}
	});
};

// creates user and api key, returns this data
var createUser = function createUser(newUser, callback) {
	// create user
	newUser.password = bcrypt.hashSync(newUser.password, 10);
	db.User
	.create(newUser)
	.success(function (user, created) {
		// create api key for user
		var newKey = uuid.v1();
		db.Key
		.create({key: newKey})
		.success(function (key, created) {
			// associate user with key
			user.setKey(key)
			.success(function (){
				callback(null, {
					"user": db.Sequelize.Utils._.merge(user.values,key.values)
				});
			})
			.error(function (errors) {
				callback(errors, false);
			});
		})
		.error(function (errors) {
			callback(errors, false);
		});
	})
	.error(function (errors) {
		callback(errors, false);
	});
};

// verifies a users credentials
var authenticateUser = function authenticateUser(user, callback) {
	// search for user
	db.User.find({
		where: {username: user.username},
		include: [db.Key]
	})
	.success(function (result) {
		// if user is found
		if (result) {
			// check password hash against provided password
			if (bcrypt.compareSync(user.password, result.password)) {
				var key = result.key;
				delete result.key;
				callback(null, db.Sequelize.Utils._.merge(result, key));
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