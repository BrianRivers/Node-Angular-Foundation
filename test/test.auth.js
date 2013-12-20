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
	it('should create a new user', function() {
		auth.createUser(new_user, function (err, results) {
			expect(results).to.not.equal(false);
			expect(results).to.be.instanceof(Object);
			expect(results).to.have.property('id');
			expect(err).to.equal(null);
			console.log(results);
		});
	});

	it('should error when user already exists', function() {
		auth.createUser(new_user, function (err, results) {
			expect(results).to.equal(false);
			expect(err).to.not.equal(null);
			console.log(err);
		});
	});
});