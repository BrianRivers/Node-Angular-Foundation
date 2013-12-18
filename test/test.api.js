var should = require('chai').should(),
	supertest = require('supertest'),
	api = supertest('http://localhost:3001');

describe('/dbtest:', function() {
	it('listing all db tables', function (done) {
		api.get('/dbtest')
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.property('data').and.be.an.instanceof(Array).and.not.be.empty;
			done();
		});
	});
});

describe('/authenticate:', function() {
	it('user and password match and exist', function (done) {
		api.post('/authenticate')
		.send({ username: 'tester', password: 'tester' })
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err);
			console.log(res.body);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('status.message').and.equal('Authorized');
			res.body.should.have.deep.property('data.user');
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
		.send({ username: 'none', password: 'none' })
		.expect(302, done);
	});
});

describe('/keytest:', function() {
	it('x-api-key header with valid api key found in db', function (done) {
		api.post('/keytest')
		.set('x-api-key', 'ABCDEFG')
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('status.message').and.equal('Authorized');
			done();
		});
	});
});

describe('/user/create:', function() {
	var user = {
		username: 'tester5',
		password: 'tester',
		first_name: 'tester',
		last_name: 'tester',
		email: 'tester5@no-reply.com'
	};

	it('created user with salt+hash password in db', function (done) {
		api.post('/user/create')
		.send(user)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.not.be.empty;
			console.log(res.body);
			done();
		});
	});

	it('error when username or email already exists', function (done) {
		api.post('/user/create')
		.send(user)
		.expect(500)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.not.be.empty;
			console.log(res.body);
			done();
		});
	});
});