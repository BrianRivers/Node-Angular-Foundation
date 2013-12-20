var auth = require('../modules/auth'),
	expect = require('chai').expect,
	should = require('chai').should();

var new_user = {
	username: 'auth_test',
	password: 'auth_test',
	first_name: 'auth_test',
	last_name: 'auth_test',
	email: 'auth_test@no-reply.com'
};

describe('createUser', function() {
	it('should create a new user with api key', function() {
		var user = auth.createUser(new_user);
	});

	it('should error when user already exists', function() {
		var user = auth.createUser(new_user);
		console.log(user);
	});
});