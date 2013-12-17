var should = require('chai').should(),
	supertest = require('supertest'),
	api = supertest('http://localhost:3001');

describe('/authenticate:', function() {
	it('user and password match and exist', function (done) {
		api.post('/authenticate')
		.send({ username: 'tester', password: 'tester' })
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('data.user');
			res.body.should.have.deep.property('data.key');
			done();
		});
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

describe('/dbtest:', function() {
	it('lists all db tables', function (done) {
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

describe('/search:', function() {
	it('returns data matching search fields', function (done) {
		api.post('/search')
		.send({ test: 'test' })
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.not.be.empty;
			done();
		});
	});
});

describe('/user/create:', function() {
	it('creates user with salt+hash password in db', function (done) {
		api.post('/user/create')
		.send({
			username: 'test_user1',
			password: 'test',
			first_name: 'test',
			last_name: 'test'
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) return done(err);
			res.body.should.not.be.empty;
			console.log(res.body.status.message);
			console.log(res.body.data);
			done();
		});
	});
});