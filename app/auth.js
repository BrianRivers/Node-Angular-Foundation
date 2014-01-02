/* User authenticaion and creation methods
------------------------------------------*/

var db = require('./db'),
	uuid = require('node-uuid'),
	bcrypt = require('bcrypt'),
	moment = require('moment');

// runs inital db setup and creates default admin user
var intialSetup = function intialSetup(callback) {
	db.sequelize
	.sync({
		force: true,
		logging: true
	})
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
	// hash new password
	newUser.password = bcrypt.hashSync(newUser.password, 10);
	// create user
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
			.error(function (err) {
				callback(err, false);
			});
		})
		.error(function (err) {
			callback(err, false);
		});
	})
	.error(function (err) {
		callback(err, false);
	});
};

// updates user with given attributes
var updateUser = function updateUser(existingUser, callback) {
	// hash updated password
	existingUser.password = bcrypt.hashSync(existingUser.password, 10);
	// find exsiting user matching id
	db.User.find({ where: { id: existingUser.id } })
	.success(function (user) {
		if (user) {
			// update user and respond with result or error
			delete existingUser.id;
			user.updateAttributes(existingUser)
			.success(function () {
				callback(null, true);
			})
			.error(function (err) {
				callback(err, false);
			});
		} else {
			callback('user not found or unable to update', false);
		}
	})
	.error(function (err) {
		callback(err, false);
	});
};

// delete user matching given id
var deleteUser = function deleteUser(existingUser, callback) {
	// find existing user matching id
	db.User.find({ where: { id: existingUser.id } })
	.success(function (user) {
		if (user) {
			// remove user and respond with result or error
			user.destroy()
			.success( function () {
				callback(null, true);
			})
			.error(function (err) {
				callback(err, false);
			});
		} else {
			callback('user not found or unable to delete', false);
		}
	})
	.error(function (err) {
		callback(err, false);
	});
};

// verifies a users credentials
var authenticateUser = function authenticateUser(user, callback) {
	// search for user
	db.User.find({
		where: { username: user.username },
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
	.error(function (err) {
		callback(err, false);
	});
};

// verifies key exists
var authenticateKey = function authenticateKey(apikey, callback) {
	// search for key
	db.Key.find({ where: { key: apikey } })
	.success(function (result) {
		// if key is found
		if (result)
			callback(null, true);
		else
			callback(null, false);
	})
	.error(function (err) {
		callback(err, false);
	});
};

module.exports.intialSetup = intialSetup;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.authenticateUser = authenticateUser;
module.exports.authenticateKey = authenticateKey;