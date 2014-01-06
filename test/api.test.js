var fs = require('fs'),
      should = require('chai').should(),
      supertest = require('supertest'),
      api = supertest('http://localhost:3001');

// Get admin user created on intial setup for API key to use with tests
var admin_user = JSON.parse(fs.readFileSync(process.cwd() + '/test/userdata.json')).user;

// DB table list test
describe('GET /dbtest', function() {
  it('lists all db tables', function (done) {
    api.get('/dbtest')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      res.body.should.have.deep.property('meta.success').and.equal(true);
      res.body.should.have.property('tables').and.be.an.instanceof(Array).and.not.be.empty;
      done();
    });
  });
});

// Data creation tests
describe('POST /:path', function() {
  // User creation
  describe('users', function() {
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
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.deep.property('user').and.be.an.instanceof(Object).and.not.be.empty;
        res.body.should.have.deep.property('user.key');
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
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
  // Key creation
  describe('keys', function() {
    var key = { key: 'testkey' };

    it('creates test key', function (done) {
      api.post('/keys')
      .set('x-api-key', admin_user.key)
      .send(key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.deep.property('keys').and.be.an.instanceof(Object).and.not.be.empty;
        done();
      });
    });

    it('error when key already exists', function (done) {
      api.post('/keys')
      .set('x-api-key', admin_user.key)
      .send(key)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
});

// Data update tests
describe('PUT /:path/:id', function() {
  // User update
  describe('users', function() {
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
        res.body.should.have.deep.property('meta.success').and.equal(true);
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
        res.body.should.have.deep.property('meta.success').and.equal(false);
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
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
  // Key update
  describe('keys', function() {
    var key = {
      id: 3,
      key: 'updatekeytest'
    };

    it('updates key with given attributes', function (done) {
      api.put('/keys/'+key.id)
      .set('x-api-key', admin_user.key)
      .send(key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        done();
      });
    });

    it('error when user does not exist to update', function (done) {
      key.id = 0;
      api.put('/keys/'+key.id)
      .set('x-api-key', admin_user.key)
      .send(key)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error when attribute values are invalid', function (done) {
      key.id = 'TEST';
      api.put('/keys/'+key.id)
      .set('x-api-key', admin_user.key)
      .send(key)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
});

// Data list test
describe('GET /:path', function() {
  // User list
  describe('users', function() {
    it('lists all users', function (done) {
      api.get('/users')
      .set('x-api-key', admin_user.key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.property('users').and.be.an.instanceof(Array).and.not.be.empty;
        done();
      });
    });
  });
  // Key list
  describe('keys', function() {
    it('lists all keys', function (done) {
      api.get('/keys')
      .set('x-api-key', admin_user.key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.property('keys').and.be.an.instanceof(Array).and.not.be.empty;
        done();
      });
    });
  });
});

// User authentication tests
describe('POST /authenticate', function() {
  it('user and password match and exist', function (done) {
    api.post('/authenticate')
    .send({ username: 'tester', password: 'tester' })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      res.body.should.have.deep.property('meta.success').and.equal(true);
      res.body.should.have.deep.property('user').and.be.an.instanceof(Object).and.not.be.empty;
      res.body.should.have.deep.property('user.key');
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

// Data delete tests
describe('DELETE /:path/:id', function() {
  // User delete
  describe('users', function() {
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
        res.body.should.have.deep.property('meta.success').and.equal(true);
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
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
  // Key delete
  describe('keys', function() {
    var key = {
      id: 3
    };

    it('removes key with given id', function (done) {
      api.del('/keys/'+key.id)
      .set('x-api-key', admin_user.key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        done();
      });
    });

    it('error when key does not exist to delete', function (done) {
      key.id = 0;
      api.del('/keys/'+key.id)
      .set('x-api-key', admin_user.key)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
});