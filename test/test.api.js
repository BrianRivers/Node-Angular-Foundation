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

describe('/user/create:', function() {
	var user = {
		username: 'admin',
		password: 'giscenter',
		first_name: '',
		last_name: '',
		email: 'apgiscenter@gmail.com'
	};

	it('created user with salt+hash password in db', function (done) {
		api.post('/user/create')
		.set('x-api-key', '356cc090-68f6-11e3-be46-a9bd7be89f21')
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
		.set('x-api-key', 'b837e7a0-68f3-11e3-96b7-9f6032743f50')
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