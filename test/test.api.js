var fs = require('fs'),
	should = require('chai').should(),
	supertest = require('supertest'),
	api = supertest('http://localhost:3001');

// Get admin user created on intial setup for API key to use with tests
var admin_user = JSON.parse(fs.readFileSync(process.cwd() + '/test/userdata.json')).user;

// DB setup test
describe('/dbtest:', function() {
	it('lists all db tables', function (done) {
		api.get('/dbtest')
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.property('data').and.be.an.instanceof(Array).and.not.be.empty;
			done();
		});
	});
});

// User creation tests
describe('POST /users', function() {
	var user = {
		username: 'test',
		password: 'test',
		firstName: 'test',
		lastName: 'test',
		email: 'test@no-reply.com'
	};

	it('creates user with salted and hashed password in db', function (done) {
		api.post('/users')
		.set('x-api-key', admin_user.key)
		.send(user)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('data.user').and.be.an.instanceof(Object).and.not.be.empty;
			res.body.should.have.deep.property('data.user.key');
			done();
		});
	});

	it('error when username or email already exists', function (done) {
		api.post('/users')
		.set('x-api-key', admin_user.key)
		.send(user)
		.expect(500)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(false);
			done();
		});
	});
});

// User update tests
describe('PUT /users/:id', function() {
	var user = {
		id: 2,
		username: 'tester',
		password: 'tester',
		firstName: 'tester',
		lastName: 'tester',
		email: 'tester@no-reply.com'
	};

	it('updates user with given attributes', function (done) {
		api.put('/users/'+user.id)
		.set('x-api-key', admin_user.key)
		.send(user)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			done();
		});
	});

	it('error when user does not exist to update', function (done) {
		user.id = 0;
		api.put('/users/'+user.id)
		.set('x-api-key', admin_user.key)
		.send(user)
		.expect(500)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(false);
			done();
		});
	});

	it('error when attribute values are invalid', function (done) {
		user.id = 'TEST';
		user.firstName = null;
		user.email = 'TEST';
		api.put('/users/'+user.id)
		.set('x-api-key', admin_user.key)
		.send(user)
		.expect(500)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(false);
			done();
		});
	});
});

// User list test
describe('GET /users', function() {
	it('lists all users', function (done) {
		api.get('/users')
		.set('x-api-key', admin_user.key)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.property('data').and.be.an.instanceof(Array).and.not.be.empty;
			done();
		});
	});
});

// User authentication tests
describe('/authenticate:', function() {
	it('user and password match and exist', function (done) {
		api.post('/authenticate')
		.send({ username: 'tester', password: 'tester' })
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('data.user').and.be.an.instanceof(Object).and.not.be.empty;
			res.body.should.have.deep.property('data.user.key');
			done();
		});
	});

	it('error when username and password do not match', function (done) {
		api.post('/authenticate')
		.send({ username: 'tester', password: 'badpassword' })
		.expect(302, done);
	});

	it('error when username and password do not exist', function (done) {
		api.post('/authenticate')
		.send({ username: 'nouser', password: 'nouser' })
		.expect(302, done);
	});
});

// User delete tests
describe('DELETE /users/:id', function() {
	var user = {
		id: 2
	};

	it('removes user with given id', function (done) {
		api.del('/users/'+user.id)
		.set('x-api-key', admin_user.key)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			done();
		});
	});

	it('error when user does not exist to delete', function (done) {
		user.id = 0;
		api.del('/users/'+user.id)
		.set('x-api-key', admin_user.key)
		.expect(500)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(false);
			done();
		});
	});
});